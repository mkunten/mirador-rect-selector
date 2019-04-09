// mirador-rect-selector.js
// highlight rectangle region via url parameters

// /* init options */
// see options below
//
// /* query parameters */
// xywh=<x>,<y>,<width>, <height>
// chars=<annotation content>
// highlight=off: otherwize regarded as highlight=on
// zoom=off: otherwize regarded as zoom=on

(function($) {
  /* ViewFromUrl (UpdateUrlFromView) plugin or like should be installed */
  if(typeof UpdateUrlFromView === 'undefined') {
    console.info('ViewFromUrl (UpdateUrlFromView) plugin or like '
      + 'should be installed.');
  }

  /* options */
  // can be set in creating new Mirador instance:
  // e.g.
  // new myMiradorInstance({
  //   rectSelector: {
  //     /* options */
  //   },
  // })
  const options = {
    margin: 300,
    highlight: 'on', // regards anything but 'off' as 'on'
    zoom: 'on', // regards anything but 'off' as 'on'
  };

  // utilily
  function parseQueryString(queryString) {
    const params = {};
    queryString.replace(/^\?/, '').split('&').forEach((e) => {
      const kv = e.split('=');
      params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || '');
    });
    return params;
  }

  /* originally defined in mirador/js/src/utils/saveController.js */
  const origFuncSaveControllerInit = $.SaveController.prototype.init;
  $.SaveController.prototype.init = function(config) {
    origFuncSaveControllerInit.apply(this, arguments);

    if(Object.prototype.hasOwnProperty.call(config, 'rectSelector')) {
      jQuery.extend(options, config.rectSelector);
    }
  };

  /* originally defined in mirador/js/src/workspaces/window.js */
  const origFuncWindowInit = $.Window.prototype.init;
  $.Window.prototype.init = function() {
    // do and reset the original function
    origFuncWindowInit.apply(this);
    $.Window.prototype.init = origFuncWindowInit;

    // prepare the annotation
    // Maybe this should be included
    // in $.Window.prototype.getAnnotations, but here
    // because 'show annotation' below must be after ImageView initialized.
    const params = parseQueryString(window.location.search);
    if(params.canvas && params.xywh.match(/^(\d+),(\d+),(\d+),(\d+)$/)) {
      // create annotation
      const id = $.genUUID();
      const annotation = {
        '@context': 'http://iiif.io/api/presentation/2/context.json',
        '@id': id,
        '@type': 'oa:Annotation',
        endpoint: 'manifest',
        motivation: [
          'oa:commenting',
        ],
        on: `${params.canvas}#xywh=${params.xywh}`,
        resource: {
          '@id': `${id}/1`,
          '@type': 'cnt:ContentAsText',
          chars: params.chars ? params.chars : '',
          format: 'text/plain',
        },
      };
      this.annotationsList.push(annotation);
      this.eventEmitter.publish('ANNOTATIONS_LIST_UPDATED', {
        windowId: this.id,
        annotationsList: this.annotationsList,
      });

      // show annotations
      this.focusModules.ImageView.hud.eventEmitter
        .publish(`SET_STATE_MACHINE_POINTER.${this.id}`);

      // highlight && tooltip
      if((typeof params.highlight !== 'undefined' && params.highlight !== 'off')
        || (options.highlight !== 'off'
        && typeof params.highlight === 'undefined')) {
        const drawTool = this.focusModules.ImageView.annotationsLayer.drawTool;
        for(const key in drawTool.annotationsToShapesMap) {
          if(Function.prototype.hasOwnProperty
            .call(drawTool.annotationsToShapesMap, key)) {
            drawTool.annotationsToShapesMap[key].forEach((shape) => {
              // highlight
              if(shape._data.annotation['@id'] === id) {
                shape.strokeWidth = shape.data.strokeWidth
                  / drawTool.svgOverlay.paperScope.view.zoom;
                shape.data.nonHoverStrokeColor = shape.strokeColor.clone();
                shape.strokeColor = drawTool.state
                  .getStateProperty('drawingToolsSettings').hoverColor;
              }
              // // show tooltip
              // /* want to show tooltip from the beginning!
              //  *   make it about triggerEvent...
              //  * */
              // drawTool.annoTooltip.showViewer({
              //   annotations: [ shape._data.annotation ],
              //   triggerEvent: null,
              //   shouldDisplayTooltip: (api) => true,
              // });
            });
          }
        }
      }

      // zoom
      if((typeof params.zoom !== 'undefined' && params.zoom !== 'off')
        || (options.zoom !== 'off' && typeof params.zoom === 'undefined')) {
        const xywh = params.xywh.split(',')
          .map((v, i) => parseInt(v, 10)
            + (i < 2 ? -options.margin : options.margin * 2));
        const bounds = new (Function.prototype.bind
          .apply(OpenSeadragon.Rect, [null].concat(xywh)));
        this.focusModules.ImageView.osd.viewport.fitBounds(bounds);
      }
    }
  };
})(Mirador);
