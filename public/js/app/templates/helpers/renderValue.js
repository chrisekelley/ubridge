define(['handlebars', 'hbs!templates/doNotRender', 'hbs!templates/recordValue', 'hbs!templates/recordDropdownValue',
  'hbs!templates/recordMDYTimeDateValue', 'hbs!templates/displayHeaderWidget', 'hbs!templates/recordCheckboxAlert',
  'hbs!templates/displayTableWidget', 'hbs!templates/buttonWidget', 'hbs!templates/hiddenWidget', 'hbs!templates/dropdownWidgetCascade'],
  function ( Handlebars, doNotRender, recordValue, recordDropdownValue, recordMDYTimeDateValue, displayHeaderWidget,
             recordCheckboxAlert, displayTableWidget, buttonWidget, hiddenWidget, dropdownWidgetCascade ){
  function renderValue (context, format) {
    //console.log("renderValue:" + JSON.stringify(context));
    var template;
    var html = "";
    var useTemplate = true;
    var datatype = this.datatype;
    var inputType = this.inputType;
    var visible = this.visible;
    var tblCols = this.tblCols;
    var closeRow = this.closeRow;
    var identifier = this.identifier;
    var size = this.size;
    var maxlength = this.maxlength;
    var beginElement = "";
    var endElement = "";
    if (format === 'value') {
      this.renderValueElement = 1;
    } else {
      this.renderFormElement = 2;
    }
    if (closeRow == "true") {
      //endElement = "</td></tr>\n<tr>\n";
    }
    if (inputType == 'text') {
      if (size == null || size == 0) {
        this.size = 20;
      }
      if (maxlength == null || maxlength == 0) {
        this.maxlength = 255;
      }
      template = recordValue;
    } else if (inputType == 'patientid') {
      template = recordValue;
    } else if (inputType == 'birthdate') {
      template = recordValue;
    } else if (inputType == 'emptyDate') {
      template = recordValue;
    } else if (inputType == 'checkbox') {
      template = recordCheckboxValueCompiledHtml;
    } else if (inputType == 'alertCheckbox') {
      template = recordCheckboxAlert;
    } else if (inputType == 'dropdown-add-one') {
      template = recordDropdownCSVValueCompiledHtml;
    } else if (inputType == 'dropdown') {
      template = recordDropdownCSVValueCompiledHtml;
    } else if (inputType == 'select') {
      template = recordDropdownCSVValueCompiledHtml;
    } else if (inputType == 'selectFDA') {
      template = recordDropdownValue;
    } else if (inputType == 'selectCascadeParent') {
      template = dropdownWidgetCascade;
    } else if (inputType == 'selectCascadeChild') {
      template = recordDropdownValue;
    } else if (inputType == 'textarea') {
      template = recordValue;
    } else if (inputType == 'yesno_br') {
      template = recordYesnoValueCompiledHtml;
    } else if (inputType == 'Yes/No') {
      template = recordYesnoValueCompiledHtml;
    } else if (inputType == 'gender') {
      template = recordGenderValueCompiledHtml;
	  } else if (inputType == 'display-tbl-begin') {
		  template = displayTableWidget;
    } else if (inputType == 'display-header') {
      template = displayHeaderWidget;
    } else if (inputType == 'display-sub-header') {
      template = displaySubHeaderWidgetCompiledHtml;
    } else if (inputType == 'infotext') {
      template = displayInfotextWidgetCompiledHtml;
    } else if (inputType == 'display-actionTakenLink') {
      template = displayActionTakenLinkCompiledHtml;
    } else if (inputType == 'hidden') {
      template = hiddenWidget;
    } else if (inputType == 'hiddenButDisplay') {
      template = recordMDYTimeDateValue;
    } else if (inputType == 'button') {
      template = buttonWidget;
    } else {
      useTemplate = false;
    };
    if (useTemplate) {
      if (datatype == "display") {
        html = beginElement + template(this) + endElement;
      } else if (inputType == 'hidden') {
        html = beginElement + template(this) + endElement;
      } else {
        var labelHtml = "<label for='" + identifier + "'>" + this.label + "</label>";
        var errorHtml = " <span class='error-message' style='display:none'></span>";
        var templateHtml = "";
        if (format === 'value') {
          if (this.value != null) {
            templateHtml = template(this);
          }
        } else {
          templateHtml = template(this);
        }
        //if (this.value != null) {
//        if (inputType == 'alertCheckbox') {
//          html = beginElement + templateHtml + errorHtml + endElement;
//        } else {
          html = beginElement + labelHtml + templateHtml + errorHtml + endElement;
//        }
//        } else {
//          if (inputType == 'alertCheckbox') {
//            html = beginElement + errorHtml + endElement;
//          } else {
//            html = beginElement + labelHtml + errorHtml + endElement;
//          }
//        }
        //console.log("useTemplate: " + useTemplate + " inputType: " + inputType + " closeRow: " + closeRow + " html: "+ html);
      }
    } else {
      if (html == "") {
        html = beginElement + "No template for inputType: " + inputType + endElement;
      }
      console.log("html: " + html);
    }
    return html;
  }

  Handlebars.registerHelper( 'renderValue', renderValue );
  return renderValue;
});