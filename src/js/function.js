'use strict';
import { router } from './router.js';
import { svgAnimation } from './animation.js';
const $ = require('jquery');


$(function() {
  let $formObject = $("form[data-formType]");
  let $containerObject = $("[data-state]");
  let confirmText = "確認";
  let confirmErrorText = "再入力";
  $formObject.find("#submitBtn").prop("checked", true);
  $formObject.find("#confirmBtn").val(confirmText);


  const Pattern = {
    checkEmail: function(el) {
      return el.val().match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,})*$/) === null ? false : true;
    },
    checkTel: function(el) {
      return el.val().match(/^0\d{9,10}$/) === null ? false : true;
    },

    checkZipCode: function(el) {
      return el.val().match(/^\d{7}$/) === null ? false : true;
    },

    radioRequired: function(el) {
      let elName = el.attr('name');
      let allRadio = $formObject.find('input[name="' + elName + '"]:checked');
      return allRadio.length ? true : false;
    },

    checkboxRequired: function(el) {
      let elName = el.attr('name');
      let allCheck = $formObject.find('input[name="' + elName + '"]:checked');
      return allCheck.length ? true : false;
    },

    checkExist: function(el) {
      let elVlue = el.val();
      return elVlue.length ? true : false;
    },

    checkSelectRequired: function(el) {
      let checked = el.find('option:selected');
      return checked.val().length ? true : false;
    },

    textareaRequired: function(el) {
      let elVlue = el.val();
      return elVlue.length ? true : false;
    }

  }

  //
  let Error = {
    errorMsg: {
      warning: "入力に誤りがあります。再度入力してください。",
      confirmation: "以下の内容で間違いは無いでしょうか。",
      required: "入力してください。",
      email: "メールアドレスのパターンではありません。",
      tel: "電話番号のパターンではありません。",
      zipCode: "郵便番号のパターンではありません。",
      radioRequired: "どれかにはチェックをつけてください。",
      selectRequired: "選択してください。",
      checkboxRequired: "どれかにはチェックをつけてください。",
      textareaRequired: "入力してください"
    },

    ddHas: function(el) {
      return el.parents("dd").hasClass("error") ? true : false;
    },
    ddAdd: function(el) {
      el.parents("dd").addClass("error");
    },
    ddRemove: function(el) {
      el.parents("dd").removeClass("error");
    },
    message: function(type) {
      return this.errorMsg[type] ? this.errorMsg[type] : null;
    },
    appendMessage: function(el, type) {
      if (this.message(type)) {
        let Msg = this.message(type);
        $('<p>', {
          class: 'errorMsg',
          text: Msg
        }).appendTo(el.parents("dd"));
        $("p.errorMsg").fadeIn(700);
      }
    },
    resetWarning: function() {
      if ($formObject.find(".warning.error").text().length) {
        $formObject.find(".warning.error").text("");
        $formObject.find(".warning.error").removeClass("error");
      }
      else if ($formObject.find(".warning.confirm").text().length) {
        $formObject.find(".warning.confirm").text("");
        $formObject.find(".warning.confirm").removeClass("confirm");
      }
    },
    appendWarning: function() {
      $formObject.find(".warning").text(this.message("warning"));
      $formObject.find(".warning").fadeIn(700);
      $formObject.find(".warning").addClass("error");
    },
    appendConfirmText: function() {
      $formObject.find(".warning").text(this.message("confirmation"));
      $formObject.find(".warning").fadeIn(700);
      $formObject.find(".warning").addClass("confirm");
    },

    resetError: function(el) {
      if (el.parents("dd.error").find("p.errorMsg").length) {
        el.parents("dd.error").find("p.errorMsg").remove();
      }
      if (el.parents("dd").hasClass("error")) {
        el.parents("dd").removeClass("error");
      }
    },

    display: function(el, t) {
      this.appendMessage(el, t);
      this.ddAdd(el);
    },
  }

  let Validation = {

    checkAllForm: function() {
      let checkForForm = this.checkForForm;
      let dateValidation = $formObject.find('input[date-validation],select[date-validation],textarea[date-validation]');
      let allFormFlg = true;
      dateValidation.each(function() {
        let validateObj = $(this);
        Error.resetError(validateObj);
        let validateTypes = $(this)
          .attr("date-validation")
          .split("|");

        for (let i = 0; i < validateTypes.length; i++) {
          if (checkForForm(validateObj, validateTypes[i]) !== true) {
            Error.display(validateObj, validateTypes[i]);
            if (allFormFlg === true) allFormFlg = false;
            break;
          }
        }
      });
      return allFormFlg;
    },

    checkForForm: function(obj, type) {
      if (type === "required") {
        return Pattern.checkExist(obj);
      }
      else if (type === "tel") {
        return Pattern.checkTel(obj);
      }
      else if (type === "email") {
        return Pattern.checkEmail(obj);
      }
      else if (type === "zipCode") {
        return Pattern.checkZipCode(obj);
      }
      else if (type === "radioRequired") {
        return Pattern.radioRequired(obj);
      }
      else if (type === "selectRequired") {
        return Pattern.checkSelectRequired(obj);
      }
      else if (type === "checkboxRequired") {
        return Pattern.checkboxRequired(obj);
      }
      else if (type === "textareaRequired") {
        return Pattern.textareaRequired(obj);
      }
    }
  }

  let ButtonOnBehavior = {
    confirmBtn: function() {
      return $formObject.find("#confirmBtn");
    },
    submitBtn: function() {
      return $formObject.find("#submitBtn");
    },
    confirmBox: function() {
      return $formObject.find("#confirmBox");
    },
    returnBox: function() {
      return $formObject.find("#returnBox");
    },
    submitBox: function() {
      return $formObject.find("#submitBox");
    },
    ddAll: function() {
      return $formObject.find("dd");
    },
    step: function() {
      return $(".s-wrap");
    },

    confirmBtnOnClick: function(buttonId) {
      let validateFlg = false;
      this.confirmBtn().removeClass("error");
      Error.resetWarning();
      validateFlg = Validation.checkAllForm();
      if (validateFlg === true) {
        this.switchViewButton(buttonId);
        this.switchFormClass(buttonId);
        this.ddSwitchClass(buttonId);
        this.switchDisabled(buttonId);
        this.submitBtn().prop("disabled", false);
        this.confirmBtn().val(confirmText);
        this.switchSteps(buttonId);
        Error.appendConfirmText();
        router("confirm");
      }
      else {
        Error.appendWarning();
        this.confirmBtn().val(confirmErrorText);
        this.confirmBtn().addClass("error");
        $('html,body').animate({
          scrollTop: 400
        }, 700, 'swing');
        this.submitBtn().prop("disabled", true);
        router("error");
      }
    },

    returnBtnOnClick: function(buttonId) {
      Error.resetWarning()
      this.switchViewButton(buttonId);
      this.switchFormClass(buttonId);
      this.ddSwitchClass(buttonId);
      this.switchDisabled(buttonId);
      this.switchSteps(buttonId);
      this.submitBtn().prop("disabled", true);
      router("contact");
      
    },

    submitsBtnOnClick: function(buttonId) {
      this.ddSwitchClass(buttonId);
      this.switchDisabled(buttonId);
      this.switchSteps(buttonId);
      router("thanks");
      $containerObject.attr("data-state","thanks")
      svgAnimation();
      //FormEventBehavior.sendMail();
    },


    switchViewButton: function(bottonID) {
      if (bottonID === "confirmBtn") {
        this.confirmBox().addClass("hid");
        this.returnBox().removeClass("hid");
        this.submitBox().removeClass("hid");
      }
      else if (bottonID === "returnBtn") {
        this.confirmBox().removeClass("hid");
        this.returnBox().addClass("hid");
        this.submitBox().addClass("hid");
      }
    },

    switchFormClass: function(bottonID) {
      if (bottonID === "confirmBtn") {
        $formObject.addClass("confirm");
      }
      else if (bottonID === "returnBtn") {
        $formObject.removeClass("confirm");
      }
    },

    switchSteps: function(bottonID) {
      this.step().find(".current").removeClass("current");
      if (bottonID === "confirmBtn") {
        this.step().find('#two').addClass("current");
      }
      else if (bottonID === "returnBtn") {
        this.step().find('#one').addClass("current");
      }
      else if (bottonID === "submitBtn") {
        this.step().find('#three').addClass("current");
      }
    },

    ddSwitchClass: function(bottonID) {
      this.ddAll().each(function() {
        if (bottonID === "confirmBtn") {
          if ($(this).hasClass("submit_btns") === false) {
            $(this).addClass("cf_confirm");
          }
        }
        else if (bottonID === "returnBtn") {
          $(this).removeClass("cf_confirm");
        }
      });
    },

    switchDisabled: function(bottonID) {
      if (bottonID === "confirmBtn") {
        $formObject.find('input:not(".submitsBtns")').prop('disabled', true);
        $formObject.find("textarea").prop('disabled', true);
        $formObject.find("select").prop('disabled', true);
      }
      else if (bottonID === "returnBtn" || bottonID === "submitBtn") {
        $formObject.find('input:not(".submitsBtns")').prop('disabled', false);
        $formObject.find("textarea").prop('disabled', false);
        $formObject.find("select").prop('disabled', false);
      }
    }
  }

  let FormEventBehavior = {
    replaceHyphen: function(e) {
      let eTargetAttr = e.target.getAttribute("date-validation");
      let eTargetValue = e.target.value;
      let $eTarget = $(e.target);
      let attreVlidation = eTargetAttr.split("|");
      let replaceTarget = attreVlidation.filter(function(x){ return (x === "tel") || (x === "zipCode")});
      if(replaceTarget.length){
        let replacedText = eTargetValue.replace(/[-|−|-|－|﹣|−|‐|⁃|‑|―|⎯|₋|一|⼀|㆒]/g,"");
        $eTarget.val(replacedText);
      }
    },

    replaceSpace: function(e) {
      let eTargetValue = e.target.value;
      let eTarget = $(e.target);
      eTarget.val(eTargetValue.trim());
    },

    autoHalf: function(e) {
      let eTargetAttr = e.target.getAttribute("date-validation");
      let eTargetName = e.target.getAttribute("name");
      let $eTarge = $(e.target);
      let eTargetValue = e.target.value;
      let eTargetReplaced = this.replaceHalf(eTargetValue, eTargetAttr);
      $eTarge.val(eTargetReplaced);
    },

    halfType: function(dateValidation) {
      if (dateValidation === "required|tel") {
        return /[０-９]/g;
      }
      else if (dateValidation === "required|email") {
        return /[Ａ-Ｚａ-ｚ０-９]/g;
      }
      else if (dateValidation === "required|zipCode") {
        return /[０-９]/g;
      }
    },

    replaceHalf: function(eValue, eAttr) {
      return eValue.replace(this.halfType(eAttr), function(s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
      });
    },
    
    removeError: function(el) {
      let targetName = el.target.name;
      let targetObj = $(`[ name = '${targetName}' ]`);
      let parentBox = targetObj.closest("dd");
      let parentWrap = targetObj.closest(".form-wrap");
      let warningMsg = parentWrap.children(".warning");
      if(parentBox.hasClass("error")){
        parentBox.removeClass("error");
        parentBox.children(".errorMsg").remove();
        if(warningMsg.hasClass("error")){
          warningMsg.text('');
          warningMsg.removeClass("error");
        }
      }
    },
    sendMail: function () {
      const mailer = functions.httpsCallable('sendMail')
      
      mailer()
        .then(() => {
          console.log(err)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  $formObject.on("click", 'input[type="button"]', function() {
    let bottonID = $(this).attr('id');

    if (bottonID == "confirmBtn") {
      ButtonOnBehavior.confirmBtnOnClick(bottonID);
    }
    else if (bottonID == "returnBtn") {
      ButtonOnBehavior.returnBtnOnClick(bottonID);
    }
    else if (bottonID == "submitBtn") {
      ButtonOnBehavior.submitsBtnOnClick(bottonID);
    }
  });

  $formObject.on("blur", 'input[date-validation]', function(e) {
    FormEventBehavior.replaceSpace(e);
    FormEventBehavior.autoHalf(e);
    FormEventBehavior.replaceHyphen(e);
  });
  
  $formObject.on("keyup", 'input[date-validation],textarea[date-validation]', function(e) {
    FormEventBehavior.removeError(e);
  });

  $formObject.on("change", 'input[type="checkbox"][date-validation],input[type="radio"][date-validation],select[date-validation]', function(e) {
    FormEventBehavior.removeError(e);
  });

});
