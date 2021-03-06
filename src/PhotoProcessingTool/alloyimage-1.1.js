console.log('alloyt')
Array.prototype.del = function (h) {
  h.sort();
  for (var q = this.concat([]), b = h.length - 1; 0 <= b; b--)
    q = q.slice(0, h[b]).concat(q.slice(h[b] + 1));
  return q;
};
HTMLImageElement.prototype.loadOnce = function (h) {
  var q = 0;
  this.onload = function () {
    q || h.call(this, null);
    q++;
  };
};
(function (h) {
  var q = {
    lib: [],
    init: function () {
      this.require("config");
    },
    module: function (b, a) {
      this.lib[b] = a.call(null, this);
    },
    require: function (b) {
      var a = this,
        c = document.createElement("script");
      document.body.appendChild(c);
      c.src = "./js/module/" + b + ".js";
      c.onload = c.onerror = function (c) {
        a.handlerror(c);
      };
    },
    handlerror: function () {},
    destroySelf: function (b) {
      delete window[h];
      throw Error(b);
    },
    reflect: function (b, a, c) {
      b = this.lib.config.getModuleName(b);
      return this.lib[b].process(a, c);
    },
    reflectEasy: function (b) {
      b = this.lib.config.getEasyFun(b);
      return this.lib.easy.getFun(b);
    },
    add: function (b, a, c, f, g, e, j, l) {
      return this.lib.addLayer.add(b, a, c, f, g, e, j, l);
    },
    applyMatrix: function () {},
  };
  window[h] = function (b, a, c) {
    if (this instanceof window[h]) {
      this.startTime = +new Date();
      var f = document.createElement("canvas"),
        g = f.getContext("2d");
      isNaN(b)
        ? ((f.width = parseInt(b.width)),
          (f.height = parseInt(b.height)),
          (a = getComputedStyle(b)),
          (imgWidth = parseInt(a.getPropertyValue("width"))),
          (imgHeight = parseInt(a.getPropertyValue("height"))),
          isNaN(imgWidth)
            ? g.drawImage(b, 0, 0)
            : g.drawImage(b, 0, 0, imgWidth, imgHeight))
        : ((f.width = b),
          (f.height = a),
          (g.fillStyle = c || "#fff"),
          g.fillRect(0, 0, b, a));
      this.canvas = f;
      this.context = g;
      this.imgData = g.getImageData(0, 0, f.width, f.height);
      this.name = h + "_" + Math.random();
      this.canvas.id = this.name;
      this.layers = [];
      b = document.createElement("canvas");
      b.width = f.width;
      b.height = f.height;
      this.ctxCanvas = b;
      this.ctxContext = f.getContext("2d");
    } else return new window[h](b, a, c);
  };
  window[h].module = function (b, a) {
    q.module(b, a);
  };
  window[h].dorsyMath = function () {
    return q.lib.dorsyMath;
  };
  window[h].prototype = {
    act: function (b, a) {
      var c = [],
        c = Array.prototype.slice.call(arguments, 1);
      q.reflect(b, this.imgData, c);
      return this;
    },
    view: function (b, a, c, f, g) {
      var e = this.clone();
      e.type = 1;
      this.addLayer(e, "\u6b63\u5e38", 0, 0);
      e.act(b, a, c, f, g);
      return this;
    },
    excute: function () {
      var b = this.layers,
        a = b.length;
      b[a - 1] &&
        1 == b[a - 1][0].type &&
        ((this.imgData = b[a - 1][0].imgData), delete b[a - 1]);
    },
    cancel: function () {
      var b = this.layers,
        a = b.length;
      b[a - 1] && 1 == b[a - 1][0].type && delete b[a - 1];
    },
    show: function (b, a) {
      var c = new window[h](this.canvas.width, this.canvas.height);
      c.add(this, "\u6b63\u5e38", 0, 0, a);
      this.tempPsLib = c;
      for (var f = 0; f < this.layers.length; f++) {
        var g = this.layers[f],
          e = g[0].layers,
          j = g[0];
        e[e.length - 1] &&
          1 == e[e.length - 1][0].type &&
          (j = e[e.length - 1][0]);
        c.add(j, g[1], g[2], g[3], a);
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.putImageData(c.imgData, 0, 0);
      b
        ? document.querySelector(b).appendChild(this.canvas)
        : document.body.appendChild(this.canvas);
      return this;
    },
    replace: function (b) {
      b && ((b.onload = function () {}), (b.src = this.save()));
      return this;
    },
    add: function () {
      var b = [],
        a,
        c,
        f,
        g,
        e;
      for (f = 0; f < arguments.length; f++)
        if (f)
          switch (typeof arguments[f]) {
            case "string":
              /\d+%/.test(arguments[f])
                ? (c = arguments[f].replace("%", ""))
                : /[RGB]+/.test(arguments[f])
                ? (e = arguments[f])
                : (a = arguments[f]);
              break;
            case "number":
              b.push(arguments[f]);
              break;
            case "boolean":
              g = arguments[f];
          }
      f = b[0] || 0;
      b = b[1] || 0;
      this.imgData = q.add(
        this.imgData,
        arguments[0].imgData,
        a || "\u6b63\u5e38",
        c / 100 || 1,
        f,
        b,
        g || !1,
        e || "RGB"
      );
      return this;
    },
    addLayer: function (b, a, c, f) {
      this.layers.push([b, a, c, f]);
      return this;
    },
    clone: function () {
      var b = new window[h](this.canvas.width, this.canvas.height);
      b.context.putImageData(this.imgData, 0, 0);
      b.imgData = b.context.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      return b;
    },
    swap: function (b, a) {
      var c = this.layers[b];
      this.layers[b] = this.layers[a];
      this.layers[a] = c;
      return this;
    },
    deleteLayers: function (b) {
      this.layers = this.layers.del(b);
    },
    save: function (b) {
      if (!this.layers.length)
        return (
          this.context.putImageData(this.imgData, 0, 0), this.canvas.toDataURL()
        );
      var a = new window[h](this.canvas.width, this.canvas.height);
      a.add(this, "\u6b63\u5e38", 0, 0, b);
      this.tempPsLib = a;
      for (var c = 0; c < this.layers.length; c++) {
        var f = this.layers[c],
          g = f[0].layers,
          e = f[0];
        g[g.length - 1] &&
          1 == g[g.length - 1][0].type &&
          (e = g[g.length - 1][0]);
        a.add(e, f[1], f[2], f[3], b);
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.putImageData(a.imgData, 0, 0);
      return this.canvas.toDataURL();
    },
    drawRect: function () {
      var b;
      if (!(b = document.getElementById("imgRect")))
        (b = document.createElement("canvas")),
          (b.id = "imgRect"),
          document.body.appendChild(b),
          (b.width = parseInt(this.canvas.width)),
          (b.height = parseInt(this.canvas.height));
      var a = b.getContext("2d");
      a.clearRect(0, 0, b.width, b.height);
      for (
        var c = [], f = this.tempPsLib.imgData.data, g = 0, e = f.length;
        g < e;
        g++
      )
        c[f[g]] ? c[f[g]]++ : (c[f[g]] = 1);
      a.beginPath();
      a.moveTo(0, b.height);
      for (g = f = 0; 255 > g; g++) c[g] > f && (f = c[g]);
      for (g = 0; 255 > g; g++)
        (e = c[g] || 0),
          (e = b.height - 0.8 * (e / f) * b.height),
          a.lineTo((g / 256) * b.width, e, 1, 1);
      a.lineTo(b.width + 10, b.height);
      a.fill();
    },
    ps: function (b) {
      var a;
      a = q.reflectEasy(b).call(this);
      this.logTime("\u7ec4\u5408\u6548\u679c" + b);
      return a;
    },
    logTime: function (b) {
      console.log(b + ": " + (+new Date() - this.startTime) / 1e3 + "s");
    },
    ctx: function (b) {
      var a = this.ctxContext;
      a.putImageData(this.imgData, 0, 0);
      b.call(a);
      this.imgData = a.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      return this;
    },
  };
})("psLib");
window.AlloyImage = $AI = window.psLib;
(function (h) {
  window[h].module("ImageEnhance", function () {
    return {
      process: function (q) {
        for (var b = q.data, a = 0, c = b.length; a < c; a += 4);
        q.data = b;
        return q;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("addLayer", function () {
    return {
      add: function (q, b, a, c, f, g, e, j) {
        e = q.data;
        var l = b.data;
        f = f || 0;
        g = g || 0;
        c = c || 1;
        j = j || "RGB";
        /[RGB]+/.test(j) || (j = "RGB");
        var n = j.replace("R", "0").replace("G", "1").replace("B", "2"),
          k;
        j = q.width;
        var h = l.length;
        b = b.width;
        for (
          var n = [
              -1 < n.indexOf("0"),
              -1 < n.indexOf("1"),
              -1 < n.indexOf("2"),
            ],
            d,
            p,
            m = 0,
            s = e.length;
          m < s;
          m += 4
        )
          if (
            ((d = m / 4),
            (p = parseInt(d / j)),
            (d %= j),
            (p -= g),
            (d -= f),
            (p = p * b + d),
            (p *= 4),
            0 <= p && p < h - 4 && d < b && 0 <= d)
          )
            for (d = 0; 3 > d && 0 != l[p + 3]; d++)
              switch (((e[m + 3] = l[p + 3]), a)) {
                case "\u989c\u8272\u51cf\u6de1":
                  n[d] &&
                    ((k = e[m + d] + (e[m + d] * l[p + d]) / (255 - l[p + d])),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u53d8\u6697":
                  n[d] &&
                    ((k = e[m + d] < l[p + d] ? e[m + d] : l[p + d]),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u53d8\u4eae":
                  n[d] &&
                    ((k = e[m + d] > l[p + d] ? e[m + d] : l[p + d]),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u6b63\u7247\u53e0\u5e95":
                  n[d] &&
                    ((k = parseInt((e[m + d] * l[p + d]) / 255)),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u6ee4\u8272":
                  n[d] &&
                    ((k = parseInt(
                      255 - ((255 - e[m + d]) * (255 - l[p + d])) / 255
                    )),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u53e0\u52a0":
                  n[d] &&
                    ((k =
                      127.5 >= e[m + d]
                        ? (e[m + d] * l[p + d]) / 127.5
                        : 255 - ((255 - e[m + d]) * (255 - l[p + d])) / 127.5),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u5f3a\u5149":
                  n[d] &&
                    ((k =
                      127.5 >= l[p + d]
                        ? (e[m + d] * l[p + d]) / 127.5
                        : e[m + d] +
                          ((255 - e[m + d]) * (l[p + d] - 127.5)) / 127.5),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u5dee\u503c":
                  n[d] &&
                    ((k =
                      e[m + d] > l[p + d]
                        ? e[m + d] - l[p + d]
                        : l[p + d] - e[m + d]),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u6392\u9664":
                  n[d] &&
                    ((k = e[m + d] + l[p + d] - (e[m + d] * l[p + d]) / 127.5),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u70b9\u5149":
                  n[d] &&
                    ((k =
                      e[m + d] < 2 * l[p + d] - 255
                        ? 2 * l[p + d] - 255
                        : e[m + d] < 2 * l[p + d]
                        ? e[m + d]
                        : 2 * l[p + d]),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u989c\u8272\u52a0\u6df1":
                  n[d] &&
                    ((k = 255 - (255 * (255 - e[m + d])) / l[p + d]),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u7ebf\u6027\u52a0\u6df1":
                  n[d] &&
                    ((k = e[m + d] + l[p + d]),
                    (k = 255 < k ? k - 255 : 0),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u7ebf\u6027\u51cf\u6de1":
                  n[d] &&
                    ((k = e[m + d] + l[p + d]),
                    (k = 255 < k ? 255 : k),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u67d4\u5149":
                  n[d] &&
                    ((k =
                      127.5 > l[p + d]
                        ? (((2 * l[p + d] - 255) * (255 - e[m + d])) / 65025 +
                            1) *
                          e[m + d]
                        : (2 * l[p + d] - 255) *
                            (Math.sqrt(e[m + d] / 255) - e[m + d] / 255) +
                          e[m + d]),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u4eae\u5149":
                  n[d] &&
                    ((k =
                      127.5 > l[p + d]
                        ? 255 * (1 - (255 - e[m + d]) / (2 * l[p + d]))
                        : e[m + d] / (2 * (1 - l[p + d] / 255))),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u7ebf\u6027\u5149":
                  n[d] &&
                    ((k = e[m + d] + 2 * l[p + d] - 255),
                    (k = 255 < k ? 255 : k),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                case "\u5b9e\u8272\u6df7\u5408":
                  n[d] &&
                    ((k = l[p + d] < 255 - e[m + d] ? 0 : 255),
                    (e[m + d] = (1 - c) * e[m + d] + c * k));
                  break;
                default:
                  n[d] &&
                    ((k = l[p + d]), (e[m + d] = (1 - c) * e[m + d] + c * k));
              }
        return q;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("brightness", function () {
    return {
      process: function (q, b) {
        for (
          var a = q.data,
            c = b[0] / 50,
            f = Math.tan(((45 + 44 * ((b[1] || 0) / 50)) * Math.PI) / 180),
            g = 0,
            e = a.length;
          g < e;
          g += 4
        )
          for (var j = 0; 3 > j; j++)
            a[g + j] = (a[g + j] - 127.5 * (1 - c)) * f + 127.5 * (1 + c);
        return q;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("applyMatrix", function (q) {
    return {
      process: function (b) {
        for (
          var a = b.data,
            c = b.width,
            f = new q.lib.dorsyMath.Matrix(
              [
                -2, -4, -4, -4, -2, -4, 0, 8, 0, -4, -4, 8, 24, 8, -4, -4, 0, 8,
                0, -4, -2, -4, -4, -4, -2,
              ],
              25,
              1
            ),
            g = [],
            e = 0,
            j = a.length;
          e < j;
          e += 4
        ) {
          var l = e / 4,
            n = parseInt(l / c),
            k = l % c;
          if (!(0 == n || 0 == k)) {
            for (var h = [[], [], []], d = -2; 3 > d; d++)
              for (var p = n + d, m = -2; 3 > m; m++)
                for (var s = 4 * (p * c + (k + m)), l = 0; 3 > l; l++)
                  h[l].push(a[s + l]);
            n = new q.lib.dorsyMath.Matrix(h, 3, matrixSize).mutiply(f);
            for (l = 0; 3 > l; l++) g[e + l] = n.data[l];
            g[e + 4] = a[e + 4];
          }
        }
        e = 0;
        for (j = a.length; e < j; e++) a[e] = g[e] || a[e];
        return b;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("config", function () {
    var q = {
        "\u7070\u5ea6\u5904\u7406": "toGray",
        "\u53cd\u8272": "toReverse",
        "\u7070\u5ea6\u9608\u503c": "toThresh",
        "\u9ad8\u65af\u6a21\u7cca": "gaussBlur",
        "\u4eae\u5ea6": "brightness",
        "\u6d6e\u96d5\u6548\u679c": "embossment",
        "\u67e5\u627e\u8fb9\u7f18": "borderline",
        "\u8272\u76f8/\u9971\u548c\u5ea6\u8c03\u8282": "setHSI",
        "\u9a6c\u8d5b\u514b": "mosaic",
        "\u6cb9\u753b": "oilPainting",
        "\u8150\u8680": "corrode",
        "\u9510\u5316": "sharp",
        "\u6dfb\u52a0\u6742\u8272": "noise",
        "\u66f2\u7ebf": "curve",
        "\u6697\u89d2": "darkCorner",
        "\u55b7\u70b9": "dotted",
      },
      b = {
        "\u7f8e\u80a4": "softenFace",
        "\u7d20\u63cf": "sketch",
        "\u81ea\u7136\u589e\u5f3a": "softEnhancement",
        "\u7d2b\u8c03": "purpleStyle",
        "\u67d4\u7126": "soften",
        "\u590d\u53e4": "vintage",
        "\u9ed1\u767d": "gray",
        "\u4efflomo": "lomo",
        "\u4eae\u767d\u589e\u5f3a": "strongEnhancement",
        "\u7070\u767d": "strongGray",
        "\u7070\u8272": "lightGray",
        "\u6696\u79cb": "warmAutumn",
        "\u6728\u96d5": "carveStyle",
        "\u7c97\u7cd9": "rough",
      };
    return {
      getModuleName: function (a) {
        return q[a] || a;
      },
      getEasyFun: function (a) {
        return b[a] || a;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("corrode", function () {
    return {
      process: function (q, b) {
        for (
          var a = parseInt(b[0]) || 3,
            c = q.data,
            f = q.width,
            g = q.height,
            e = 0;
          e < f;
          e++
        )
          for (var j = 0; j < g; j++)
            for (
              var l = parseInt(2 * Math.random() * a) - a,
                n = parseInt(2 * Math.random() * a) - a,
                k = j * f + e,
                l = (j + l) * f + e + n,
                n = 0;
              3 > n;
              n++
            )
              c[4 * k + n] = c[4 * l + n];
        return q;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("curve", function (q) {
    return {
      process: function (b, a) {
        for (
          var c = q.lib.dorsyMath.lagrange(a[0], a[1]),
            f = b.data,
            g = b.width,
            e = b.height,
            j = 0;
          j < g;
          j++
        )
          for (var l = 0; l < e; l++)
            for (var n = l * g + j, k = 0; 3 > k; k++)
              f[4 * n + k] = c(f[4 * n + k]);
        return b;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("darkCorner", function (q) {
    return {
      process: function (b, a) {
        for (
          var c = parseInt(a[0]) || 3,
            f = a[1] || 30,
            g = b.data,
            e = b.width,
            j = b.height,
            l = (2 * e) / 3,
            n = (1 * j) / 2,
            k = q.lib.dorsyMath.distance([l, n]),
            c = k * (1 - c / 10),
            h = 0;
          h < e;
          h++
        )
          for (var d = 0; d < j; d++)
            for (var p = d * e + h, m = 0; 3 > m; m++) {
              var s;
              s = g[4 * p + m];
              var r = (q.lib.dorsyMath.distance([h, d], [l, n]) - c) / (k - c);
              0 > r && (r = 0);
              s =
                ((0 * Math.pow(1 - r, 3) +
                  0.06 * r * Math.pow(1 - r, 2) +
                  3 * 0.3 * r * r * (1 - r) +
                  1 * Math.pow(r, 3)) *
                  s *
                  f) /
                255;
              g[4 * p + m] -= s;
            }
        return b;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("dorsyMath", function (q) {
    var b = {
      FFT1: function (a) {
        function c() {
          g++;
          for (var j = f / Math.pow(2, g), n = f / j, k = 0; k < j; k++)
            for (
              var q = k * n,
                d = (k + 1) * n - 1,
                p = g,
                m = Math.pow(2, p - 1),
                h = 0;
              q <= d - m;
              q++
            ) {
              var r = q + m,
                v = (h * f) / Math.pow(2, p),
                u = v + f / 4;
              a[q] instanceof b.C || (a[q] = new b.C(a[q]));
              a[r] instanceof b.C || (a[r] = new b.C(a[r]));
              v = a[q].plus(a[r].mutiply(e[v]));
              u = a[q].plus(a[r].mutiply(e[u]));
              a[q] = v;
              a[r] = u;
              h++;
            }
          1 < j && c();
        }
        for (var f = a.length, g = 0, e = [], j = 0; j < f; j++)
          e[j] = this.exp((-2 * Math.PI * j) / f);
        c();
        return a;
      },
      DFT: function () {},
      Matrix: function (a, c, b) {
        var g = [];
        if (c) {
          if (isNaN(c)) {
            var e = /(\d+)\*/.exec(c)[1];
            c = /\*(\d+)/.exec(c)[1];
          } else (e = c), (c = b);
          if (a[0] && a[0][0])
            for (b = 0; b < e; b++) {
              g[b] = [];
              for (var j = 0; j < c; j++) g[b][j] = a[b][j] || 0;
            }
          else
            for (b = 0; b < e; b++) {
              g[b] = [];
              for (j = 0; j < c; j++) g[b][j] = a[b * c + j] || 0;
            }
          this.m = e;
          this.n = c;
        } else (this.m = a.length), (this.n = a[0].length);
        this.data = g;
      },
      C: function (a, c) {
        this.r = a || 0;
        this.i = c || 0;
      },
      exp: function (a, c) {
        a = a || 0;
        c = c || 1;
        var f = new b.C();
        f.r = c * Math.cos(a);
        f.i = c * Math.sin(a);
        return f;
      },
      lagrange: function (a, c) {
        var b = a.length;
        return function (g) {
          for (var e = 0, j = 0; j < b; j++) {
            for (var l = 1, n = 1, k = 0; k < b; k++)
              k != j && ((l *= a[j] - a[k]), (n *= g - a[k]));
            e += c[j] * (n / l);
          }
          return e;
        };
      },
      applyMatrix: function (a, c, f) {
        f = f || 0;
        var g = a.data,
          e = a.width,
          j = c.length;
        c = new b.Matrix(c, j, 1);
        for (
          var l = [], n = -(Math.sqrt(j) - 1) / 2, k = 0, h = g.length;
          k < h;
          k += 4
        ) {
          var d = k / 4,
            p = parseInt(d / e),
            m = d % e;
          if (!(0 == p || 0 == m)) {
            for (var s = [[], [], []], r = n; r <= -n; r++)
              for (var v = p + r, u = n; u <= -n; u++)
                for (var w = 4 * (v * e + (m + u)), d = 0; 3 > d; d++)
                  s[d].push(g[w + d]);
            p = new q.lib.dorsyMath.Matrix(s, 3, j).mutiply(c);
            for (d = 0; 3 > d; d++) l[k + d] = p.data[d];
            l[k + 4] = g[k + 4];
          }
        }
        k = 0;
        for (h = g.length; k < h; k++) l[k] && (g[k] = l[k] < f ? l[k] : g[k]);
        return a;
      },
      RGBToHSI: function (a, c, b) {
        var g =
            (a - c + a - b) /
              2 /
              Math.sqrt((a - c) * (a - c) + (a - b) * (c - b)) || 0,
          g = Math.acos(g),
          g = b > c ? 2 * Math.PI - g : g,
          e = 1 - (3 * Math.min(a, c, b)) / (a + c + b);
        g > 2 * Math.PI && (g = 2 * Math.PI);
        0 > g && (g = 0);
        return { H: g, S: e, I: (a + c + b) / 3 };
      },
      HSIToRGB: function (a, b, f) {
        0 > a ? ((a %= 2 * Math.PI), (a += 2 * Math.PI)) : (a %= 2 * Math.PI);
        if (a <= (2 * Math.PI) / 3)
          var g = f * (1 - b),
            e = f * (1 + (b * Math.cos(a)) / Math.cos(Math.PI / 3 - a)),
            j = 3 * f - (e + g);
        else
          a <= (4 * Math.PI) / 3
            ? ((a -= (2 * Math.PI) / 3),
              (e = f * (1 - b)),
              (j = f * (1 + (b * Math.cos(a)) / Math.cos(Math.PI / 3 - a))),
              (g = 3 * f - (j + e)))
            : ((a -= (4 * Math.PI) / 3),
              (j = f * (1 - b)),
              (g = f * (1 + (b * Math.cos(a)) / Math.cos(Math.PI / 3 - a))),
              (e = 3 * f - (j + g)));
        return { R: e, G: j, B: g };
      },
      applyInHSI: function (a, b) {
        for (var f = a.data, g = 0, e = f.length; g < e; g += 4) {
          var j = this.RGBToHSI(f[g], f[g + 1], f[g + 2]);
          b(j);
          1 < j.S && (j.S = 1);
          0 > j.S && (j.S = 0);
          j = this.HSIToRGB(j.H, j.S, j.I);
          f[g] = j.R;
          f[g + 1] = j.G;
          f[g + 2] = j.B;
        }
      },
      applyInCoordinate: function () {},
      distance: function (a, c) {
        c = c || [0, 0];
        a = new b.C(a[0], a[1]);
        c = new b.C(c[0], c[1]);
        return a.minus(c).distance();
      },
      xyToIFun: function (a) {
        return function (b, f, g) {
          return 4 * (f * a + b) + (g || 0);
        };
      },
      xyCal: function (a, b, f, g, e) {
        for (var j = this.xyToIFun(a.width), l = 0; 3 > l; l++) {
          var n = j(b, f, l);
          a[n] = g(a[n]);
        }
        e && (a[n + 1] = e(a[n + 1]));
      },
    };
    b.Matrix.prototype = {
      plus: function (a) {
        if (this.m != a.m || this.n != a.n)
          throw Error("\u77e9\u9635\u52a0\u6cd5\u884c\u5217\u4e0d\u5339\u914d");
        for (var c = new b.Matrix([], this.m, this.n), f = 0; f < this.m; f++)
          for (var g = 0; g < this.n; g++)
            c.data[f][g] = this.data[f][g] + a.data[f][g];
        return c;
      },
      minus: function (a) {
        if (this.m != a.m || this.n != a.n)
          throw Error(
            "\u77e9\u9635\u51cf\u6cd5\u6cd5\u884c\u5217\u4e0d\u5339\u914d"
          );
        for (var c = new b.Matrix([], this.m, this.n), f = 0; f < this.m; f++)
          for (var g = 0; g < this.n; g++)
            c.data[f][g] = this.data[f][g] - a.data[f][g];
        return c;
      },
      mutiply: function (a) {
        if (this.n != a.m)
          throw Error("\u77e9\u9635\u4e58\u6cd5\u884c\u5217\u4e0d\u5339\u914d");
        for (var c = new b.Matrix([], this.m, a.n), f = 0; f < this.m; f++)
          for (var g = 0; g < a.n; g++) {
            for (var e = 0, j = 0; j < this.n; j++)
              e += this.data[f][j] * a.data[j][g];
            c.data[f][g] = e;
          }
        return c;
      },
    };
    b.C.prototype = {
      plus: function (a) {
        var c = new b.C();
        c.r = this.r + a.r;
        c.i = this.i + a.i;
        return c;
      },
      minus: function (a) {
        var c = new b.C();
        c.r = this.r - a.r;
        c.i = this.i - a.i;
        return c;
      },
      mutiply: function (a) {
        var c = new b.C();
        c.r = this.r * a.r - this.i * a.i;
        c.i = this.r * a.i + this.i * a.r;
        return c;
      },
      divide: function (a) {
        var c = new b.C(),
          f = a.mutiply(a.conjugated());
        a = this.mutiply(a.conjugated());
        c.r = a.r / f.r;
        c.i = a.i / f.r;
        return c;
      },
      conjugated: function () {
        return new b.C(this.r, -this.i);
      },
      distance: function () {
        return Math.sqrt(this.r * this.r + this.i * this.i);
      },
    };
    return b;
  });
})("psLib");
(function (h) {
  window[h].module("dotted", function (q) {
    return {
      process: function (b, a) {
        for (
          var c = parseInt(a[0]) || 1,
            f = parseInt(a[1]) || 1,
            g = b.data,
            e = b.width,
            j = b.height,
            l = 2 * c + 1,
            n = [],
            k = f * f,
            f = -c;
          f < c;
          f++
        )
          for (var h = -c; h < c; h++) f * f + h * h > k && n.push([f, h]);
        c = q.lib.dorsyMath.xyToIFun(e);
        f = 0;
        for (e = parseInt(e / l); f < e; f++) {
          h = 0;
          for (k = parseInt(j / l); h < k; h++)
            for (
              var d = parseInt((f + 0.5) * l),
                p = parseInt((h + 0.5) * l),
                m = 0;
              m < n.length;
              m++
            ) {
              var s = d + n[m][0],
                r = p + n[m][1];
              g[c(s, r, 3)] = 225;
              g[c(s, r, 2)] = 225;
              g[c(s, r, 0)] = 225;
              g[c(s, r, 1)] = 225;
            }
        }
        return b;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("easy", function () {
    return {
      getFun: function (q) {
        return {
          softenFace: function () {
            return this.clone()
              .add(this.act("\u9ad8\u65af\u6a21\u7cca", 10), "\u6ee4\u8272")
              .act("\u4eae\u5ea6", -10, 5);
          },
          sketch: function () {
            var b = this.act("\u7070\u5ea6\u5904\u7406").clone();
            return this.add(
              b.act("\u53cd\u8272").act("\u9ad8\u65af\u6a21\u7cca", 8),
              "\u989c\u8272\u51cf\u6de1"
            ).act("\u9510\u5316", 1);
          },
          softEnhancement: function () {
            return this.act("\u66f2\u7ebf", [0, 190, 255], [0, 229, 255]);
          },
          purpleStyle: function () {
            var b = this.clone();
            return this.add(
              b.act("\u9ad8\u65af\u6a21\u7cca", 3),
              "\u6b63\u7247\u53e0\u5e95",
              "RG"
            );
          },
          soften: function () {
            var b = this.clone();
            return this.add(
              b.act("\u9ad8\u65af\u6a21\u7cca", 6),
              "\u53d8\u6697"
            );
          },
          vintage: function () {
            this.clone();
            return this.act("\u7070\u5ea6\u5904\u7406").add(
              window[h](this.canvas.width, this.canvas.height, "#808080")
                .act("\u6dfb\u52a0\u6742\u8272")
                .act("\u9ad8\u65af\u6a21\u7cca", 4)
                .act(
                  "\u8272\u76f8/\u9971\u548c\u5ea6\u8c03\u8282",
                  32,
                  19,
                  0,
                  !0
                ),
              "\u53e0\u52a0"
            );
          },
          gray: function () {
            return this.act("\u7070\u5ea6\u5904\u7406");
          },
          lomo: function () {
            return this.clone()
              .add(this.clone(), "\u6ee4\u8272")
              .add(this.clone(), "\u67d4\u5149")
              .add(this.clone().act("\u53cd\u8272"), "\u6b63\u5e38", "20%", "B")
              .act("\u6697\u89d2", 6, 200);
          },
          strongEnhancement: function () {
            return this.clone().add(
              this.clone().act("\u66f2\u7ebf", [0, 50, 255], [0, 234, 255]),
              "\u67d4\u5149"
            );
          },
          strongGray: function () {
            return this.act("\u7070\u5ea6\u5904\u7406").act(
              "\u66f2\u7ebf",
              [0, 61, 69, 212, 255],
              [0, 111, 176, 237, 255]
            );
          },
          lightGray: function () {
            return this.act("\u7070\u5ea6\u5904\u7406").act(
              "\u66f2\u7ebf",
              [0, 60, 142, 194, 255],
              [0, 194, 240, 247, 255]
            );
          },
          warmAutumn: function () {
            var b = this.clone()
              .act("\u8272\u76f8/\u9971\u548c\u5ea6\u8c03\u8282", 36, 47, 8, !0)
              .act("\u6697\u89d2", 6, 150);
            return this.add(b, "\u53e0\u52a0");
          },
          carveStyle: function () {
            var b = this.clone()
              .act("\u9a6c\u8d5b\u514b")
              .act("\u67e5\u627e\u8fb9\u7f18")
              .act("\u6d6e\u96d5\u6548\u679c");
            return this.add(b, "\u7ebf\u6027\u5149");
          },
          rough: function () {
            return this.add(
              window[h](this.canvas.width, this.canvas.height, "#000")
                .act("\u55b7\u70b9")
                .act("\u53cd\u8272")
                .act("\u6d6e\u96d5\u6548\u679c"),
              "\u53e0\u52a0"
            );
          },
        }[q];
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("embossment", function () {
    return {
      process: function (q) {
        for (
          var b = q.data, a = q.width, c = [], f = 0, g = b.length;
          f < g;
          f += 4
        ) {
          var e = f / 4,
            j = parseInt(e / a),
            l = e % a,
            e = 4 * ((j - 1) * a + (l - 1)),
            n = 4 * (j + 1) * a + 4 * (l + 1);
          if (!(0 == j || 0 == l)) {
            for (j = 0; 3 > j; j++) c[f + j] = b[e + j] - b[n + j] + 127.5;
            c[f + 4] = b[f + 4];
          }
        }
        f = 0;
        for (g = b.length; f < g; f++) b[f] = c[f] || b[f];
        return q;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("gaussBlur", function () {
    return {
      process: function (q, b, a) {
        var c = q.data,
          f = q.width,
          g = q.height,
          e = [],
          j = 0,
          l,
          n,
          k,
          h,
          d,
          p;
        b = Math.floor(b) || 3;
        a = a || b / 3;
        l = 1 / (Math.sqrt(2 * Math.PI) * a);
        h = -1 / (2 * a * a);
        d = 0;
        for (a = -b; a <= b; a++, d++)
          (k = l * Math.exp(h * a * a)), (e[d] = k), (j += k);
        d = 0;
        for (a = e.length; d < a; d++) e[d] /= j;
        for (l = 0; l < g; l++)
          for (a = 0; a < f; a++) {
            j = n = k = h = 0;
            for (p = -b; p <= b; p++)
              (d = a + p),
                0 <= d &&
                  d < f &&
                  ((d = 4 * (l * f + d)),
                  (n += c[d] * e[p + b]),
                  (k += c[d + 1] * e[p + b]),
                  (h += c[d + 2] * e[p + b]),
                  (j += e[p + b]));
            d = 4 * (l * f + a);
            c[d] = n / j;
            c[d + 1] = k / j;
            c[d + 2] = h / j;
          }
        for (a = 0; a < f; a++)
          for (l = 0; l < g; l++) {
            j = n = k = h = 0;
            for (p = -b; p <= b; p++)
              (d = l + p),
                0 <= d &&
                  d < g &&
                  ((d = 4 * (d * f + a)),
                  (n += c[d] * e[p + b]),
                  (k += c[d + 1] * e[p + b]),
                  (h += c[d + 2] * e[p + b]),
                  (j += e[p + b]));
            d = 4 * (l * f + a);
            c[d] = n / j;
            c[d + 1] = k / j;
            c[d + 2] = h / j;
          }
        q.data = c;
        return q;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("borderline", function (h) {
    return {
      process: function (b) {
        return h.lib.dorsyMath.applyMatrix(
          b,
          [0, 1, 0, 1, -4, 1, 0, 1, 0],
          250
        );
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("mosaic", function () {
    return {
      process: function (h, b) {
        for (
          var a = parseInt(b[0]) || 3,
            c = h.data,
            f = h.width,
            g = h.height,
            a = 2 * a + 1,
            e = 0,
            j = parseInt(f / a);
          e < j;
          e++
        )
          for (var l = 0, n = parseInt(g / a); l < n; l++) {
            for (var k = [], t = [0, 0, 0], d = 0; d < a; d++)
              for (var p = 0; p < a; p++) {
                var m = (l * a + d) * f + e * a + p;
                t[0] += c[4 * m];
                t[1] += c[4 * m + 1];
                t[2] += c[4 * m + 2];
              }
            k[0] = t[0] / (a * a);
            k[1] = t[1] / (a * a);
            k[2] = t[2] / (a * a);
            for (d = 0; d < a; d++)
              for (p = 0; p < a; p++)
                (m = (l * a + d) * f + e * a + p),
                  (c[4 * m] = k[0]),
                  (c[4 * m + 1] = k[1]),
                  (c[4 * m + 2] = k[2]);
          }
        return h;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("noise", function () {
    return {
      process: function (h, b) {
        for (
          var a = parseInt(b[0]) || 100,
            c = h.data,
            f = h.width,
            g = h.height,
            e = 0;
          e < f;
          e++
        )
          for (var j = 0; j < g; j++)
            for (var l = j * f + e, n = 0; 3 > n; n++) {
              var k = parseInt(2 * Math.random() * a) - a;
              c[4 * l + n] += k;
            }
        return h;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("oilPainting", function () {
    return {
      process: function (h, b) {
        for (
          var a = parseInt(b[0]) || 16,
            c = h.data,
            f = h.width,
            g = h.height,
            e = 0;
          e < f;
          e++
        )
          for (var j = 0; j < g; j++) {
            for (var l = j * f + e, n = 0, k = 0; 3 > k; k++) n += c[4 * l + k];
            n /= 3;
            n = parseInt(n / a) * a;
            for (k = 0; 3 > k; k++) c[4 * l + k] = n;
          }
        return h;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("setHSI", function (h) {
    return {
      process: function (b, a) {
        a[0] = (a[0] / 180) * Math.PI;
        a[1] = a[1] / 100 || 0;
        a[2] = 255 * (a[2] / 100) || 0;
        a[3] = a[3] || !1;
        h.lib.dorsyMath.applyInHSI(b, function (b) {
          a[3] ? ((b.H = a[0]), (b.S = a[1])) : ((b.H += a[0]), (b.S += a[1]));
          b.I += a[2];
        });
        return b;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("sharp", function () {
    return {
      process: function (h, b) {
        for (
          var a = b[0] || 0.6, c = h.data, f = h.width, g = 0, e = c.length;
          g < e;
          g += 4
        ) {
          var j = g / 4,
            l = parseInt(j / f),
            n = j % f;
          if (!(0 == l || 0 == n))
            for (
              var k = 4 * ((l - 1) * f + (n - 1)),
                l = 4 * ((l - 1) * f + n),
                j = 4 * (j - 1),
                n = 0;
              3 > n;
              n++
            )
              c[g + n] += (c[g + n] - (c[l + n] + c[j + n] + c[k + n]) / 3) * a;
        }
        return h;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("toGray", function () {
    return {
      process: function (h) {
        for (var b = h.data, a = 0, c = b.length; a < c; a += 4) {
          var f = parseInt((b[a] + b[a + 1] + b[a + 2]) / 3);
          b[a + 2] = b[a + 1] = b[a] = f;
        }
        h.data = b;
        return h;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("toReverse", function () {
    return {
      process: function (h) {
        for (var b = h.data, a = 0, c = b.length; a < c; a += 4)
          (b[a] = 255 - b[a]),
            (b[a + 1] = 255 - b[a + 1]),
            (b[a + 2] = 255 - b[a + 2]);
        h.data = b;
        return h;
      },
    };
  });
})("psLib");
(function (h) {
  window[h].module("toThresh", function (h) {
    return {
      process: function (b, a) {
        b = h.lib.toGray.process(b);
        var c = b.data;
        a = a[0] || 128;
        for (var f = 0, g = c.length; f < g; f++)
          (f + 1) % 4 && (c[f] = c[f] > a ? 255 : 0);
        b.data = c;
        return b;
      },
    };
  });
})("psLib");
