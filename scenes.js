(function () {
  var n = 0;

  function windows(x, y, cols, rows, w, h, gap, fill) {
    var s = "";
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        s += '<rect x="' + (x + c * (w + gap)) + '" y="' + (y + r * (h + gap)) + '" width="' + w + '" height="' + h + '" rx="1.2" fill="' + fill + '"/>';
      }
    }
    return s;
  }

  function frame(id, sky, inner) {
    return '<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<defs><filter id="' + id + '" x="-20%" y="-20%" width="140%" height="140%">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>' +
      '<feColorMatrix type="saturate" values="0"/>' +
      '<feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>' +
      '</filter></defs>' +
      '<rect width="640" height="480" fill="' + sky + '"/>' +
      inner +
      '<rect width="640" height="480" filter="url(#' + id + ')" opacity="0.35"/>' +
      '</svg>';
  }

  var scenes = {
    towers: function (id) {
      return frame(id, "#e4cdb0",
        '<ellipse cx="320" cy="430" rx="300" ry="46" fill="#b7c9a4"/>' +
        '<rect x="78" y="168" width="132" height="250" rx="4" fill="#d7c2a2"/>' +
        '<rect x="228" y="78" width="176" height="340" rx="4" fill="#c9b18e"/>' +
        '<rect x="424" y="150" width="140" height="268" rx="4" fill="#ead7b8"/>' +
        windows(96, 188, 3, 8, 26, 16, 10, "#8e7a62") +
        windows(248, 98, 4, 11, 28, 16, 12, "#7d6a54") +
        windows(442, 170, 3, 8, 28, 16, 12, "#a08b70") +
        '<circle cx="64" cy="392" r="28" fill="#6f8f5c"/>' +
        '<circle cx="96" cy="404" r="18" fill="#87a56c"/>' +
        '<circle cx="560" cy="400" r="26" fill="#6f8f5c"/>' +
        '<rect x="70" y="418" width="500" height="62" fill="#c5d4b2"/>'
      );
    },
    villa: function (id) {
      return frame(id, "#dcc7a6",
        '<rect x="0" y="300" width="640" height="180" fill="#8eaa6e"/>' +
        '<path d="M320 300 L470 430 L170 430 Z" fill="#a33b3b"/>' +
        '<rect x="150" y="196" width="340" height="168" fill="#f3e6cf"/>' +
        '<path d="M132 196 L320 78 L508 196 Z" fill="#c4a47a"/>' +
        '<rect x="292" y="268" width="56" height="96" rx="2" fill="#9a2340"/>' +
        '<rect x="186" y="236" width="64" height="48" rx="2" fill="#7f9aab"/>' +
        '<rect x="390" y="236" width="64" height="48" rx="2" fill="#7f9aab"/>' +
        '<rect x="196" y="246" width="44" height="28" fill="#e7f1f4"/>' +
        '<rect x="400" y="246" width="44" height="28" fill="#e7f1f4"/>' +
        '<rect x="150" y="352" width="340" height="12" fill="#e4d3b4"/>' +
        '<circle cx="108" cy="360" r="36" fill="#5f844c"/>' +
        '<circle cx="540" cy="352" r="42" fill="#6d9158"/>' +
        '<rect x="248" y="118" width="28" height="40" fill="#efe2cc"/>'
      );
    },
    modern: function (id) {
      return frame(id, "#d2c0a4",
        '<rect x="0" y="318" width="640" height="162" fill="#b7c6a2"/>' +
        '<rect x="70" y="168" width="360" height="168" fill="#f4ead8"/>' +
        '<rect x="70" y="148" width="390" height="28" fill="#c6a98a"/>' +
        '<rect x="430" y="196" width="150" height="140" fill="#e7d7be"/>' +
        '<rect x="108" y="196" width="150" height="110" fill="#8aa4b4"/>' +
        '<rect x="118" y="206" width="130" height="90" fill="#d5e6ea"/>' +
        '<rect x="300" y="210" width="18" height="100" fill="#b08968"/>' +
        '<rect x="326" y="210" width="18" height="100" fill="#c4a07a"/>' +
        '<rect x="352" y="210" width="18" height="100" fill="#b08968"/>' +
        '<rect x="456" y="230" width="96" height="72" rx="2" fill="#7f96a6"/>' +
        '<rect x="470" y="360" width="92" height="28" rx="8" fill="#2a2422"/>' +
        '<circle cx="492" cy="388" r="12" fill="#1a1614"/>' +
        '<circle cx="542" cy="388" r="12" fill="#1a1614"/>' +
        '<circle cx="64" cy="300" r="34" fill="#6e9156"/>' +
        '<rect x="58" y="300" width="12" height="50" fill="#6b5344"/>'
      );
    },
    courtyard: function (id) {
      return frame(id, "#e6d3b6",
        '<rect x="0" y="280" width="640" height="200" fill="#9bb57a"/>' +
        '<rect x="80" y="150" width="200" height="180" fill="#f0e2cc"/>' +
        '<path d="M64 150 L180 62 L296 150 Z" fill="#c9ae86"/>' +
        '<rect x="150" y="230" width="48" height="100" fill="#9a2340"/>' +
        '<rect x="108" y="190" width="46" height="36" fill="#8aa4b4"/>' +
        '<rect x="300" y="190" width="250" height="140" fill="#e7d4b6"/>' +
        '<rect x="300" y="172" width="250" height="22" fill="#c4a882"/>' +
        windows(322, 214, 5, 3, 32, 22, 12, "#8e7a62") +
        '<ellipse cx="470" cy="390" rx="90" ry="22" fill="#7fa066"/>' +
        '<circle cx="560" cy="250" r="30" fill="#5f844c"/>'
      );
    },
    row: function (id) {
      return frame(id, "#e7dcc8",
        '<rect x="0" y="340" width="640" height="140" fill="#d5e2c4"/>' +
        '<rect x="40" y="120" width="150" height="250" rx="6" fill="#f4efe6"/>' +
        '<rect x="210" y="70" width="170" height="300" rx="6" fill="#f7f4ee"/>' +
        '<rect x="400" y="150" width="190" height="220" rx="6" fill="#efe8dc"/>' +
        windows(58, 142, 3, 7, 32, 18, 12, "#c5d0d4") +
        windows(230, 92, 3, 9, 36, 18, 14, "#c5d0d4") +
        windows(422, 172, 4, 6, 32, 18, 12, "#c5d0d4") +
        '<rect x="0" y="368" width="640" height="18" fill="#c9d7b4"/>' +
        '<circle cx="36" cy="360" r="22" fill="#7ea06a"/>' +
        '<circle cx="600" cy="356" r="26" fill="#6f945c"/>'
      );
    },
    cottage: function (id) {
      return frame(id, "#e2d0b4",
        '<rect x="0" y="310" width="640" height="170" fill="#8fad70"/>' +
        '<rect x="160" y="176" width="280" height="160" fill="#f6edd9"/>' +
        '<path d="M136 176 L300 70 L464 176 Z" fill="#b4534a"/>' +
        '<rect x="268" y="236" width="64" height="100" fill="#7c3a32"/>' +
        '<rect x="196" y="214" width="52" height="42" fill="#8eafc0"/>' +
        '<rect x="352" y="214" width="52" height="42" fill="#8eafc0"/>' +
        '<rect x="470" y="300" width="120" height="36" rx="10" fill="#a33b3b"/>' +
        '<circle cx="496" cy="336" r="12" fill="#241c1a"/>' +
        '<circle cx="564" cy="336" r="12" fill="#241c1a"/>' +
        '<circle cx="96" cy="330" r="40" fill="#5e8448"/>' +
        '<rect x="90" y="330" width="12" height="48" fill="#6b5344"/>' +
        '<rect x="188" y="118" width="22" height="36" fill="#f3e6cf"/>'
      );
    }
  };

  window.sceneSvg = function (name) {
    var draw = scenes[name] || scenes.towers;
    n += 1;
    return draw(name + "-" + n);
  };
})();
