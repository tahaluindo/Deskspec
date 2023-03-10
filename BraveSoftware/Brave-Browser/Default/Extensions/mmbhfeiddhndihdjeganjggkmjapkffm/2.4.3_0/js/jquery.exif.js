//Copyright 2019 and Patent Pending. 2020-07-01 15:13:11
(function($) {
  var parent;
  WebFontConfig = {google:{families:["Quicksand::latin", "Oswald::latin"]}};
  (function() {
    if (!document.getElementsByTagName("head").length) {
      var head = document.createElement("head");
      document.documentElement.appendChild(head);
      (function(parent, files) {
        for (var i = 0; i < files.length; i++) {
          var node = document.createElement("style");
          node.setAttribute("src", "chrome-extension://lgadhmdnnblebpamahaideimeibckhaj/" + files[i]);
          parent.appendChild(node);
        }
      })(head, ["css/dark-hive/jquery-ui-1.9.2.custom.css", "css/base.css"]);
    }
  })();
  function float2exposure(ex) {
    if (ex.toString().indexOf(".") > 0) {
      var parts = ex.toString().split(".");
      if (parts[0] && parts[0] != "0") {
        return ex;
      }
      var f = parts[1];
      return "1/" + Math.floor(Math.pow(10, f.length) / parseInt(f.replace(/^0*/, ""))).toString();
    } else {
      return ex;
    }
  }
  function prettyPrint(name, tag) {
    if (name == "ExposureTime") {
      return float2exposure(tag["data"]);
    } else {
      if (tag["data"] === parseFloat(tag["data"]) && tag["data"] !== parseInt(tag["data"])) {
        tag["data"] = parseFloat(tag["data"]).toFixed(2);
      }
    }
    return (tag["prefix"] ? tag["prefix"] : "") + tag["data"] + (tag["dim"] ? tag["dim"] : "");
  }
  function gpsFrame(gps) {
    return gps ? $("<iframe />").css("width", "318px").css("height", "450px").css("border", "1px solid #cccccc").attr("url", "http://maps.google.com/maps?q=" + gps["lat"] + "," + gps["lng"] + "&ll=" + gps["lat"] + "," + gps["lng"] + "&output=embed&z=8&t=h") : "";
  }
  function toggleHiddenAttributes(show) {
    var img = $("#ExifExpand");
    if (!show) {
      table.find(".exifHiddenRow").hide();
      img.attr({"class":"exif-icon ui-icon-triangle-1-e", "title":chrome.i18n.getMessage("dialogExpand")});
    } else {
      table.find(".exifHiddenRow").show();
      img.attr({"class":"exif-icon exif-icon-triangle-1-s", "title":chrome.i18n.getMessage("dialogCollapse")});
    }
    recalculateHeight();
  }
  function recalculateHeight() {
    $("#exifDataTab").css({"margin":"0px", "padding":"0px"});
    $("#exif-scrollbar")["tinyscrollbar"]("update");
    if (true) {
      return;
    }
    $(".exif-viewport").hide();
    var totalHeight = 140, parent = $("#ExifMainTab");
    $("#exifDataTab > *:visible").each(function() {
      totalHeight += $(this).outerHeight();
    });
    var h = parent.outerHeight() - totalHeight;
    $(".exif-viewport").show();
    var th = $(".exif-overview").height();
    h = h <= 0 ? 200 : h;
    if (th > h) {
      $(".exif-viewport").outerHeight(h);
    } else {
      $(".exif-viewport").outerHeight(th);
    }
    $("#exif-scrollbar")["tinyscrollbar"]("update");
  }
  var methods = {init:function(settings, exifSettings) {
    return this.each(function() {
      var exifDataTab = null, exifContainer = null, data = settings["data"], gps = settings["gps"], src = settings["src"] ? settings["src"] : settings["originalSrc"], parent = $("<div />").attr("id", "ExifMainTab").append($("<ul />").append($("<li />").append($("<a/>").text(chrome.i18n.getMessage("dialogTitle")).attr("href", "#exifDataTab"))).append($("<li />").append($("<a/>").text(chrome.i18n.getMessage("dialogTabHistogram")).attr("href", "#exifHistogramTab"))).append($("<li />").css({"display":gps && 
      gps["lat"] && gps["lng"] ? "block" : "none"}).append($("<a/>").text(chrome.i18n.getMessage("dialogTabGeolocation")).attr("href", "#exifGpsTab")["one"]("click", function() {
        $("#exifGpsTab > iframe").each(function() {
          $(this).attr("src", this.getAttribute("url"));
        });
      })))).append(exifDataTab = $("<div />").attr("id", "exifDataTab").addClass("attributesContainer")).append($("<div />").attr("id", "exifHistogramTab").css({"text-align":"center", "padding":"0px"}).append($("<canvas width=290 height=100></canvas>").addClass("ExifHistogram")["histogram"]({"src":src, "colors":["r"]})).append($("<canvas width=290 height=100></canvas>").addClass("ExifHistogram")["histogram"]({"src":src, "colors":["g"]})).append($("<canvas width=290 height=100></canvas>").addClass("ExifHistogram")["histogram"]({"src":src, 
      "colors":["b"]}))).append($("<div />").attr("id", "exifGpsTab").append(gpsFrame(gps)).css({"padding":"0px"})).css({"height":"100%"}).tabs();
      exifDataTab.append($("<h3 class='exifAccordionHeader' />").append($("<a href='#' />").text("Preview"))).append($("<div />").css({"text-align":"center !important", "vertical-align":"center"}).append($("<a />").attr("href", +(settings["originalSrc"] ? settings["originalSrc"] : settings["src"])).append($("<div />").css({"border":"1px solid #7f7f7f", "background-color":"#3a3a3a", "margin":"0px", "height":"120px", "background-image":"url(" + (settings["originalSrc"] ? settings["originalSrc"] : settings["src"]) + 
      ")", "background-size":"contain", "background-position":"center", "background-repeat":"no-repeat"}))).hide());
      exifDataTab.append($("<h3 class='exifAccordionHeader' />").append($("<a href='#' />").text("Attributes"))).append($("<div />").css({"text-align":"center !important", "vertical-align":"center"}).append($("<table cellspacing=0 cellpadding=0 />").attr("width", "100%").addClass("exifTable").append($("<tr />").append($("<td />").addClass("exifTd").text("Image Location")).append($("<td />").addClass("exifTd").attr("title", src).text(src).click(function() {
        $(this).addClass("exifTdLong");
      }))).append($("<tr />").append($("<td />").addClass("exifTd").text("Image Size")).append($("<td />").attr("id", "ExifImageSize").addClass("exifTd exifTdShort")))).hide());
      var image = new Image;
      image.onload = function(e) {
        $("#ExifImageSize").text(this["width"] + " x " + this["height"]);
      };
      image.src = src;
      if (Object["keys"](data).length) {
        var renderTableRow = function(name, tag) {
          var text = typeof tag["data"] == "object" ? tag["data"].length : prettyPrint(name, tag, src);
          table.append(tr = $("<tr />").append($("<td />").addClass("exifTd").text(tag["label"])).append($("<td />").addClass("exifTd").addClass(text.length > 30 ? "exifTdLong" : "exifTdShort").attr({"title":text, "id":name}).text(text)));
        };
        exifDataTab.append($("<h3 class='exifAccordionHeader' />").append($("<div />").addClass("exif-content-default").append($('<span class="exif-icon exif-icon-copy exif-icon-copytoclipboard"></span>').css("display", "inline-block")).append($("<span />").text("EXIF data was copied to the clipboard").css({"line-height":"16px", "vertical-align":"top", "font-size":"10px"}).hide()).css({"display":Object["keys"](data).length ? "inline-block" : "none", "float":"left"}).click(function(e) {
          chrome.extension.sendRequest({"action":"copyToClipboard", "value":$("table.exifTable tr").map(function() {
            var tr = $(this);
            if (tr) {
              return tr.children("td:first").text() + ": " + tr.children("td:last").text();
            } else {
              return null;
            }
          }).get().join("\n")});
          $(this).find("span:last").css({"opacity":1}).show(1000).animate({"opacity":0}, 2000);
          e["stopPropagation"]();
        }).attr("title", chrome.i18n.getMessage("dialogCopyToClipboard"))).append($("<a href='#' />").text("EXIF"))).append(exifContainer = $("<div />").attr("id", "exif-scrollbar").append($('<div class="exif-scrollbar"><div class="exif-track"><div class="exif-thumb"><div class="exif-end"></div></div></div></div>')).append($("<div  class='exif-viewport'/>").css({"overflow":"hidden", "height":"200px"}).append($("<div  class='exif-overview'/>").append(table = $("<table cellspacing=0 cellpadding=0 />").attr({"width":"100%", 
        "height":"100px"}).addClass("exifTable")))).hide());
        if (Object["keys"](data).length) {
          var tr;
          $.each(data, function(name, tag) {
            if (tag["visible"]) {
              renderTableRow(name, tag);
            }
          });
          table.append($("<tr />").append($("<td colspan=2 />").append($("<span />").addClass("exif-icon ui-icon-triangle-1-e").attr({"id":"ExifExpand", "exif_attribute":name, "title":chrome.i18n.getMessage("dialogExpand")}).css({"padding-right":"4px"})).click(function() {
            toggleHiddenAttributes(!table.find("tr.exifHiddenRow:visible").length);
          })));
          $.each(data, function(name, tag) {
            if (!tag["visible"]) {
              renderTableRow(name, tag);
            }
          });
          window.setTimeout(function() {
            if (!table.find("tr.exifVisibleRow").length) {
              toggleHiddenAttributes(true);
            }
            $("#exif-scrollbar")["tinyscrollbar"]();
          }, 100);
        } else {
          exifContainer.replaceWith($("<p />").css({"color":"#ccc", "font-size":"22px", "text-align":"center"}).text(chrome.i18n.getMessage("noEXIF")));
        }
        exifDataTab.append($("<h3 class='exifAccordionHeader' />").append($("<a href='#' />").text("Histogram"))).append($("<div />").css({"text-align":"center !important", "vertical-align":"center"}).append($("<canvas width='335' height='100' style='border-radius: 3px;'></canvas>").addClass("ExifHistogram")["histogram"]({"src":src})).hide());
        if (data["Model"]) {
          var container = null;
          exifDataTab.append($("<h3 class='exifAccordionHeader' />").append($("<a href='#' />").text("Camera"))).append($("<div />").append(container = $("<div />").attr("id", "ExifViewerImages").addClass("camera-iamge-container").css({"background-image":chrome.extension.getURL("/img/ajax-loader.gif")})).hide());
          chrome.extension.sendRequest({"action":"checkShowCameraImage", "model":data["Model"]["data"], "brand":data["Make"] ? data["Make"]["data"] : ""}, function(cam) {
            if (cam) {
              container.css({"background-image":"url(" + cam["tbUrl"] + ")"}).attr("title", data["Model"]["data"]);
              if (cam["productUrl"]) {
                container.wrap($("<a class='exif-link' />").attr({"href":cam["productUrl"], "target":"_tab", "title":"Read about " + data["Model"]["data"] + " on www.dpreview.com"}));
              }
            }
          });
        }
      }
      $(this).data("exif", data).append(parent);
      var fnHandler = function() {
        var self = this;
        window.setTimeout(function() {
          recalculateHeight();
          exifSettings["accordion"] = $(self)["multiOpenAccordion"]("getActiveTabs");
          chrome.extension.sendRequest({"action":"setSeetings", "accordion":exifSettings["accordion"]});
        }, 500);
      };
      exifDataTab["multiOpenAccordion"]({"active":exifSettings["accordion"], "tabShown":fnHandler, "tabHidden":fnHandler});
    });
  }, visible:function() {
    return table.find("tr.exifVisibleRow").length > 0;
  }};
  $.fn.exif = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
      if (typeof method === "object" || typeof method === "string" || !method) {
        return methods.init.apply(this, arguments);
      }
    }
  };
})(jQuery);

