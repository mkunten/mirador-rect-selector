# mirador-rect-selector

## usage

```html
<script type="application/javascript" src="path/to/mirador.js></script>
<!-- optional (*)
  <script type="application/javascript" src="path/to/viewFromUrl.js></script>
-->
<script type="application/javascript" src="path/to/mirador-rect-selector.js></script>
<scipt type="application/javascript">
  const myMiradorInstance = new Mirador({
    // Mirador config
    /* ... */

    // rect-selector config
    rectSelector: {
      margin: 300,     // offset in zooming
      highlight: 'on', // regards anything but 'off' as 'on'
      zoom: 'on',      // regards anything but 'off' as 'on'
    },
  });
</script>
```

(*) when window is loaded, any canvas must have been loaded in any way.  

## url parameters

label | desc
 :--- | :---
`xywh` | *x,y,width,height*
`chars` | annotaion characters shown when hovered
`highlight` | see above (rect-selector config)
`zoom` | see above (rect-selector config)

## demo

[see here](https://mkunten.github.com/sandbox/mirador/?xywh=3190%2C1575%2C250%2C430&chars=%E3%81%8B%E3%81%B2&view=ImageView&manifest=https%3A%2F%2Fwww.dl.ndl.go.jp%2Fapi%2Fiiif%2F2532375%2Fmanifest.json&canvas=https%3A%2F%2Fwww.dl.ndl.go.jp%2Fapi%2Fiiif%2F2532375%2Fcanvas%2F4)


label | desc
 :--- | :---
`xywh` | `3190,1575,250,430`
`chars` | `かひ`
`view` | `ImageView`; see [ViewFromUrl]
`manifest` | https://www.dl.ndl.go.jp/api/iiif/2532375/manifest.json; see [ViewFromUrl]
`canvas` | https://www.dl.ndl.go.jp/api/iiif/2532375/canvas/4; see [ViewFromUrl] 

\* some other plugins are also installed.


[ViewFromUrl]: https://github.com/dbmdz/mirador-plugins/tree/master/ViewFromUrl
