let tempElement = null;
let IdFunction = "";
let tempSender;
let tempMessage;
let timesOfAttempt = 0;

function triggerMouseEvent(node, eventType) {
  const clickEvent = document.createEvent("MouseEvents");
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

function getElementIncludesAttribute(elements, attribute = "", value = "") {
  for (let i = 0; i < elements.length; i++) {
    if (
      elements[i].hasAttribute(attribute) &&
      elements[i].attributes.getNamedItem(attribute)?.value.includes(value)
    ) {
      return elements[i];
    }
  }
  return null;
}

function getElementByAttributes(elements, attribute = "", value = "") {
  for (let i = 0; i < elements.length; i++) {
    if (
      elements[i].hasAttribute(attribute) &&
      elements[i].attributes.getNamedItem(attribute)?.value === value
    ) {
      return elements[i];
    }
  }
  return null;
}

function triggerMouseClick(targetNode) {
  if (targetNode) {
    triggerMouseEvent(targetNode, "mouseover");
    triggerMouseEvent(targetNode, "mousedown");
    triggerMouseEvent(targetNode, "mouseup");
    targetNode.click();
    targetNode.focus();
    targetNode.blur();
    return false;
  }
  return true;
}

function continueRecoveryEmail(sender, message) {
  console.log("continueRecoveryEmail");
  IdFunction = "continueRecoveryEmail";
  tempMessage = message;
  tempSender = sender;

  const btn = getElementByAttributes(
    document.getElementsByTagName("div"),
    "data-accountrecovery",
    "false"
  );
  setTimeout(() => {
    triggerMouseClick(btn);
  }, 1000);
}

function continueRecoveryOptions(sender, message) {
  console.log("continueRecoveryOptions");
  IdFunction = "continueRecoveryOptions";
  tempMessage = message;
  tempSender = sender;

  const elementList = document.getElementsByTagName("div");
  const buttonList = [];
  for (let i = 0; i < elementList.length; i++) {
    if (
      elementList[i].hasAttribute("role") &&
      elementList[i].attributes.getNamedItem("role")?.value === "button"
    ) {
      buttonList.push(elementList[i]);
    }
  }
  setTimeout(() => {
    triggerMouseClick(buttonList[2]);
  }, 4000);
}

function inputRecoveryEmail(sender, message) {
  console.log("inputRecoveryEmail");
  IdFunction = "inputRecoveryEmail";
  tempMessage = message;
  tempSender = sender;

  const input = document.getElementsByName(
    "knowledgePreregisteredEmailResponse"
  )[0];
  triggerMouseClick(input);
  input.value = message.recovery_email;
  const btn = document.getElementsByTagName("button")[0];
  setTimeout(() => {
    triggerMouseClick(btn);
  }, 4000);
}

function reloadPage(sender, message) {
  chrome.runtime.sendMessage(
    sender.id,
    {
      action: "reloadPage",
    },
    function (response) {}
  );
}

function continueNewPassword(sender, message) {
  IdFunction = "continueNewPassword";
  tempMessage = message;
  tempSender = sender;
  setTimeout(() => {
    const accept = document.getElementsByName("accept")[0];
    triggerMouseClick(accept);
  }, 2000);
}

function speedBumpNewPassword(sender, message) {
  IdFunction = "speedBumpNewPassword";
  tempMessage = message;
  tempSender = sender;
  const passwordInput = document.getElementsByName("Password")[0];
  triggerMouseClick(passwordInput);
  passwordInput.value = message.new_password;
  setTimeout(() => {
    const confirmPasswordInput = document.getElementsByName(
      "ConfirmPassword"
    )[0];
    triggerMouseClick(confirmPasswordInput);
    confirmPasswordInput.value = message.new_password;
    setTimeout(() => {
      const button = document.getElementById("submit");
      triggerMouseClick(button);
    }, 4000);
  }, 2000);
}

function createNewPassword(sender, message) {
  IdFunction = "createNewPassword";
  tempMessage = message;
  tempSender = sender;
  const passwordInput = document.getElementsByName("Passwd")[0];
  triggerMouseClick(passwordInput);
  passwordInput.value = message.new_password;
  setTimeout(() => {
    const confirmPasswordInput = document.getElementsByName("ConfirmPasswd")[0];
    triggerMouseClick(confirmPasswordInput);
    confirmPasswordInput.value = message.new_password;
    setTimeout(() => {
      const button = document.getElementsByTagName("button")[0];
      triggerMouseClick(button);
    }, 4000);
  }, 2000);
}

function sendCurrentTaskId(sender, message) {
  chrome.runtime.sendMessage(
    {
      action: "storeCurrentTaskId",
      task_id: IdFunction,
      tab_id: message?.tab?.id,
    },
    function (response) {}
  );
}

function continueCurrent(sender, message) {
  IdFunction = message.task_id;
  tempMessage = message;
  tempSender = sender;
  console.log("continueCurrent: ", IdFunction);
  triggerStepIdByInterval(sender, message);
}

function triggerStepIdByInterval() {
  setInterval(function () {
    if (timesOfAttempt > 1) {
      console.log(`IdFunction: ${IdFunction}`);
      if (tempSender && tempMessage) {
        sendCurrentTaskId(tempSender, tempMessage);
      }
    }
    timesOfAttempt = timesOfAttempt + 1;
    switch (IdFunction) {
      case "getInfo": {
        getInfo(tempSender, tempMessage);
        break;
      }
      case "newProject": {
        newProject(tempSender, tempMessage);
        break;
      }
      case "enableDriveAPI": {
        enableDriveAPI(tempSender, tempMessage);
        break;
      }
      case "enableConsent": {
        enableConsent(tempSender, tempMessage);
        break;
      }
      case "createTestUser": {
        createTestUser(tempSender, tempMessage);
        break;
      }
      case "publishApp": {
        publishApp(tempSender, tempMessage);
        break;
      }
      case "createCredentials": {
        createCredentials(tempSender, tempMessage);
        break;
      }
      case "createAPIKey": {
        createAPIKey(tempSender, tempMessage);
        break;
      }
      case "continueLogin": {
        continueLogin(tempSender, tempMessage);
        break;
      }
      case "changePassword": {
        changePassword(tempSender, tempMessage);
        break;
      }
      case "loginGoogle": {
        loginGoogle(tempSender, tempMessage);
        break;
      }
      case "getAccountInfo": {
        getAccountInfo(tempSender, tempMessage);
        break;
      }
      case "allowConsent": {
        allowConsent(tempSender, tempMessage);
        break;
      }
      case "getCode": {
        getCode(tempSender, tempMessage);
        break;
      }
      case "continueWarning": {
        continueWarning(tempSender, tempMessage);
        break;
      }
      case "allowSummary": {
        allowSummary(tempSender, tempMessage);
        break;
      }
      case "allowSummaryVer2": {
        allowSummaryVer2(tempSender, tempMessage);
        break;
      }
      case "allowAccess": {
        allowAccess(tempSender, tempMessage);
        break;
      }
      case "continueConsole": {
        continueConsole(tempSender, tempMessage);
        break;
      }
      case "inputRecoveryEmail": {
        inputRecoveryEmail(tempSender, tempMessage);
        break;
      }
      case "continueRecoveryEmail": {
        continueRecoveryEmail(tempSender, tempMessage);
        break;
      }
      case "createNewPassword": {
        createNewPassword(tempSender, tempMessage);
        break;
      }
      case "continueNewPassword": {
        continueNewPassword(tempSender, tempMessage);
        break;
      }
      case "speedBumpNewPassword": {
        speedBumpNewPassword(tempSender, tempMessage);
        break;
      }
      case "changePasswordAuth": {
        changePasswordAuth(tempSender, tempMessage);
        break;
      }
      default:
        break;
    }
  }, 300000);
}

function handleDeletedAccount(sender, message) {
  tempSender = sender;
  tempMessage = message;
  const btn = document.getElementsByTagName("button")[1];
  triggerMouseClick(btn);
}

function changePasswordAuth(sender, message) {
  console.log("changePasswordAuth");
  IdFunction = "changePasswordAuth";
  tempSender = sender;
  tempMessage = message;
  const input = getElementByAttributes(
    document.getElementsByTagName("input"),
    "name",
    "password"
  );
  triggerMouseClick(input);
  input.value = message.password;
  setTimeout(() => {
    const button = document.getElementById("passwordNext");
    triggerMouseClick(button);
    setTimeout(() => {
      input.value = "aAbB!@#123Cc";
      setTimeout(() => {}, 2000);
      triggerMouseClick(button);
    }, 20000);
  }, 8000);
}

function changePassword(sender, message) {
  console.log("changePassword");
  IdFunction = "changePassword";
  tempSender = sender;
  tempMessage = message;
  const passwordInput = getElementByAttributes(
    document.getElementsByTagName("input"),
    "name",
    "password"
  );
  triggerMouseClick(passwordInput);
  passwordInput.value = message.new_password;
  const confirmPasswordInput = getElementByAttributes(
    document.getElementsByTagName("input"),
    "name",
    "confirmation_password"
  );
  triggerMouseClick(confirmPasswordInput);
  confirmPasswordInput.value = message.new_password;
  setTimeout(() => {
    const button = document.getElementsByTagName("button")[3];
    triggerMouseClick(button);
    chrome.runtime.sendMessage(
      sender.id,
      {
        action: "setupAccountConsoleCloud",
      },
      function (response) {}
    );
  }, 4000);
}

function getAccountInfo(sender, message) {
  console.log("getAccountInfo");
  IdFunction = "getAccountInfo";
  tempSender = sender;
  tempMessage = message;
  const emailLink = getElementByAttributes(
    document.getElementsByTagName("a"),
    "href",
    "email"
  );
  const recoveryEmail =
    emailLink.firstElementChild?.firstElementChild?.firstElementChild
      ?.firstElementChild?.nextSibling?.firstElementChild?.nextSibling
      ?.firstElementChild?.innerText;

  chrome.runtime.sendMessage(
    sender.id,
    {
      action: "getRecoveryEmail",
      recovery_email: recoveryEmail || "",
    },
    function (response) {}
  );
  setTimeout(() => {
    if (message.change_password) {
      const changePasswordLink = getElementByAttributes(
        document.getElementsByTagName("a"),
        "href",
        "signinoptions/password?continue=https%3A%2F%2Fmyaccount.google.com%2Fpersonal-info"
      );
      setTimeout(() => {
        triggerMouseClick(changePasswordLink);
      }, 4000);
    } else {
      chrome.runtime.sendMessage(
        sender.id,
        {
          action: "setupAccountConsoleCloud",
        },
        function (response) {}
      );
    }
  }, 4000);
}

function loginGoogle(sender, message) {
  console.log("loginGoogle");
  IdFunction = "loginGoogle";
  tempSender = sender;
  tempMessage = message;
  setTimeout(() => {
    const id = document.getElementById("identifierId");
    triggerMouseClick(id);
    setTimeout(() => {
      id.value = message.email;
      id.setAttribute("value", message.email);
      id.dispatchEvent(new Event("change", { bubbles: true }));
      id.dispatchEvent(new Event("blur", { bubbles: true }));
      id.dispatchEvent(new Event("input", { bubbles: true }));
      console.log(`current email: ${message.email}`);
      setTimeout(() => {
        const button = document.getElementsByTagName("button")[2];
        triggerMouseClick(button);

        setTimeout(() => {
          const password = document.getElementsByName("password")[0];
          if (password) {
            password.value = message.password;
            const passwordButton = document.getElementsByTagName("button")[1];
            triggerMouseClick(passwordButton);
            setTimeout(() => {
              const password = document.getElementsByName("password")[0];
              password.value = "aAbB!@#123Cc";
              const passwordButton = document.getElementsByTagName("button")[1];
              triggerMouseClick(passwordButton);
              setTimeout(() => {
                const password = document.getElementsByName("password")[0];
                if (
                  password.attributes.getNamedItem("aria-invalid")?.value ===
                  "true"
                ) {
                  chrome.runtime.sendMessage(
                    sender.id,
                    {
                      action: "wrongPassword",
                      tab: message.tab,
                    },
                    function (response) {}
                  );
                }
              }, 5000);
            }, 30000);
          } else {
            if (id.attributes.getNamedItem("aria-invalid")?.value === "true") {
              chrome.runtime.sendMessage(
                sender.id,
                {
                  action: "accountNotExist",
                  tab: message.tab,
                },
                function (response) {}
              );
            }
          }
        }, 8000);
      }, 2000);
    }, 4000);
  }, 4000);
}

function continueConsole(sender, message) {
  console.log("continueConsole");
  IdFunction = "continueConsole";
  tempSender = sender;
  tempMessage = message;

  const continueBtn = getElementByAttributes(
    document.getElementsByTagName("button"),
    "type",
    "button"
  );
  triggerMouseClick(continueBtn);
}

function continueLogin(sender, message) {
  console.log("continueLogin");
  IdFunction = "continueLogin";
  tempSender = sender;
  tempMessage = message;
  const elementList = document.getElementsByTagName("div");
  const buttonList = [];
  for (let i = 0; i < elementList.length; i++) {
    if (
      elementList[i].hasAttribute("role") &&
      elementList[i].attributes.getNamedItem("role")?.value === "button"
    ) {
      buttonList.push(elementList[i]);
    }
  }
  setTimeout(() => {
    triggerMouseClick(buttonList[2]);
    const btn = document.getElementsByTagName("button");
    if (btn) {
      setTimeout(() => {
        triggerMouseClick(btn[0]);
      }, 4000);
    }
  }, 4000);
}

function getElementChild(element) {
  for (let i = 0; i < element.length; i++) {
    if (
      element[i] instanceof HTMLElement &&
      element[i].hasAttribute("data-identifier")
    ) {
      tempElement = element[i];
    } else if (element[i].hasChildNodes()) {
      getElementChild(element[i].children);
    }
  }
}

function getCode() {
  console.log("getCode");
  IdFunction = "getCode";

  let elements = document.getElementsByTagName("form");
  getElementChild(elements);
  console.log("select account");
  if (tempElement.hasAttribute("data-identifier")) {
    triggerMouseClick(tempElement);
  }
}

function continueDanger(sender, message) {
  tempSender = sender;
  tempMessage = message;
  const openAdvanceLink = getElementByAttributes(
    document.getElementsByTagName("a"),
    "href",
    "#"
  );
  setTimeout(() => {
    triggerMouseClick(openAdvanceLink);
    setTimeout(() => {
      const continueLink = document.getElementsByTagName("a")[4];
      setTimeout(() => {
        triggerMouseClick(continueLink);
      }, 1000);
    }, 3000);
  }, 3000);
}

function continueWarning() {
  console.log("continueWarning");
  IdFunction = "continueWarning";
  const continueBtn = document.getElementsByTagName("button")[2];
  triggerMouseClick(continueBtn);
}

function allowConsent() {
  console.log("allowConsent");
  IdFunction = "allowConsent";
  let allowBtn = document.getElementsByTagName("div");
  let tempAllowBtn = null;
  for (let i = 0; i < allowBtn.length; i++) {
    if (
      allowBtn[i] instanceof HTMLElement &&
      allowBtn[i].hasAttribute("data-custom-id") &&
      allowBtn[i].attributes.getNamedItem("data-custom-id")?.value ===
        "oauthScopeDialog-allow"
    ) {
      tempAllowBtn = allowBtn[i];
    }
  }
  triggerMouseClick(tempAllowBtn);
}

function allowSummary(sender, message) {
  console.log("allowSummary");
  IdFunction = "allowSummary";
  tempSender = sender;
  tempMessage = message;

  const allowBtn = document.getElementsByTagName("button")[1];
  triggerMouseClick(allowBtn);
}

function allowSummaryVer2(sender, message) {
  console.log("allowSummaryVer2");
  IdFunction = "allowSummaryVer2";
  tempSender = sender;
  tempMessage = message;
  const inputList = document.getElementsByTagName("input");
  if (inputList.length > 0) {
    for (let i = 0; i < inputList.length; i++) {
      if (
        inputList[i] instanceof HTMLElement &&
        inputList[i].hasAttribute("type") &&
        inputList[i].attributes.getNamedItem("type")?.value === "checkbox"
      ) {
        setTimeout(() => {
          triggerMouseClick(inputList[i]);
        }, 500 * i);
      }
    }
  }

  setTimeout(() => {
    const btnList = document.getElementsByTagName("button");
    const allowBtn = btnList[btnList.length - 1];
    triggerMouseClick(allowBtn);
  }, 8000);
}

function allowAccess() {
  console.log("allowAccess");
  IdFunction = "allowAccess";
  const allowBtn = document.getElementById("submit_approve_access");
  triggerMouseClick(allowBtn);
}

function createAPIKey(sender, message) {
  console.log("createAPIKey");
  IdFunction = "createAPIKey";
  tempSender = sender;
  tempMessage = message;

  setTimeout(() => {
    const createCredentials = document.getElementById(
      "action-bar-create-button"
    );
    setTimeout(() => {
      triggerMouseClick(createCredentials);
      setTimeout(() => {
        const createOAuthClients = document.getElementsByTagName(
          "cfc-menu-item"
        )[0]?.firstElementChild;
        triggerMouseClick(createOAuthClients);
        setTimeout(() => {
          const inputValue = document.getElementsByTagName("input");
          let valuesList = [];
          for (let i = 0; i < inputValue.length; i++) {
            if (
              inputValue[i] instanceof HTMLElement &&
              inputValue[i].hasAttribute("readonly") &&
              inputValue[i].attributes.getNamedItem("readonly")?.value ===
                "true"
            ) {
              valuesList.push(inputValue[i].value);
            }
          }

          setTimeout(() => {
            chrome.runtime.sendMessage(
              sender.id,
              {
                action: "getAPIKey",
                API_key: valuesList[2] || "",
              },
              function (response) {}
            );
          }, 4000);
        }, 8000);
      }, 4000);
    }, 4000);
  }, 4000);
}

function getValue(sender, message) {
  tempSender = sender;
  tempMessage = message;
  const inputValue = document.getElementsByTagName("input");
  let valuesList = [];
  for (let i = 0; i < inputValue.length; i++) {
    if (
      inputValue[i] instanceof HTMLElement &&
      inputValue[i].hasAttribute("readonly") &&
      inputValue[i].attributes.getNamedItem("readonly")?.value === "true"
    ) {
      valuesList.push(inputValue[i].value);
    }
  }
  setTimeout(() => {
    chrome.runtime.sendMessage(
      sender.id,
      {
        action: "getValue",
        client_id: valuesList[0] || "",
        client_secret: valuesList[1] || "",
      },
      function (response) {}
    );
    createAPIKey(sender, message);
  }, 4000);
}

function publishApp(sender, message) {
  console.log("publishApp");
  IdFunction = "publishApp";
  tempSender = sender;
  tempMessage = message;
  const publishAppBtn = document.getElementsByClassName(
    "cfc-button-small mat-focus-indicator mat-raised-button mat-button-base"
  )[0];
  setTimeout(() => {
    triggerMouseClick(publishAppBtn);
    setTimeout(() => {
      const btnList = document.getElementsByClassName(
        "mat-focus-indicator mat-button mat-button-base mat-primary"
      );
      for (let i = 0; i < btnList.length; i++) {
        if (btnList[i].firstElementChild.innerHTML.includes("Confirm")) {
          triggerMouseClick(btnList[i]);
        }
      }
      setTimeout(() => {
        createCredentials(sender, message);
      }, 8000);
    }, 4000);
  }, 3000);
}

function createCredentials(sender, message) {
  console.log("createCredentials");
  IdFunction = "createCredentials";
  tempSender = sender;
  tempMessage = message;
  setTimeout(() => {
    const credentialsLink = document.getElementById(
      "cfctest-section-nav-item-metropolis_api_credentials"
    );
    triggerMouseClick(credentialsLink);
    setTimeout(() => {
      const createCredentials = document.getElementById(
        "action-bar-create-button"
      );
      triggerMouseClick(createCredentials);
      setTimeout(() => {
        const createOAuthClients = document.getElementsByTagName(
          "cfc-menu-item"
        )[1]?.firstElementChild;
        triggerMouseClick(createOAuthClients);
        setTimeout(() => {
          const applicationTypeInput = document.getElementsByTagName(
            "ace-select"
          )[0];
          triggerMouseClick(applicationTypeInput);
          setTimeout(() => {
            const WebAppType = document.getElementsByTagName("mat-option")[0];
            triggerMouseClick(WebAppType);
            setTimeout(() => {
              const addURIBtn = document.getElementsByClassName(
                "cfc-form-stack-add-button cfc-button-small"
              )[1];
              triggerMouseClick(addURIBtn);
              setTimeout(() => {
                const URIInput = document.getElementsByClassName(
                  "cfc-form-stack-input mat-input-element"
                )[0];
                URIInput.value = "https://example.com";
                URIInput.setAttribute("value", "https://example.com");
                URIInput.dispatchEvent(new Event("change", { bubbles: true }));
                URIInput.dispatchEvent(new Event("blur", { bubbles: true }));
                URIInput.dispatchEvent(new Event("input", { bubbles: true }));
                triggerMouseClick(URIInput);
                setTimeout(() => {
                  const saveCredentialsBtn = getElementByAttributes(
                    document.getElementsByClassName(
                      "mat-focus-indicator mat-raised-button mat-button-base"
                    ),
                    "type",
                    "submit"
                  );
                  setTimeout(() => {
                    triggerMouseClick(saveCredentialsBtn);
                    setTimeout(() => {
                      getValue(sender, message);
                    }, 12000);
                  }, 4000);
                }, 4000);
              }, 4000);
            }, 4000);
          }, 4000);
        }, 4000);
      }, 6000);
    }, 6000);
  }, 4000);
}

function createTestUser(sender, message) {
  console.log("createTestUser");
  IdFunction = "createTestUser";
  tempSender = sender;
  tempMessage = message;
  const testUserLink = document.getElementById(
    "cfctest-section-nav-item-metropolis_api_consent"
  );
  triggerMouseClick(testUserLink);
  setTimeout(() => {
    const addUserBtn = getElementByAttributes(
      document.getElementsByTagName("button"),
      "cfciamcheck",
      "oauthconfig.testusers.update"
    );
    setTimeout(() => {
      triggerMouseClick(addUserBtn);
      setTimeout(() => {
        const testUserInput = document.getElementsByClassName(
          "mat-mdc-chip-input mat-mdc-input-element"
        )[0];
        testUserInput.value = message.email;
        testUserInput.setAttribute("value", message.email);
        testUserInput.dispatchEvent(new Event("change", { bubbles: true }));
        testUserInput.dispatchEvent(new Event("blur", { bubbles: true }));
        testUserInput.dispatchEvent(new Event("input", { bubbles: true }));
        setTimeout(() => {
          const saveTestUserBtn = getElementByAttributes(
            document.getElementsByClassName(
              "mat-focus-indicator mat-raised-button mat-button-base mat-primary"
            ),
            "type",
            "submit"
          );
          triggerMouseClick(saveTestUserBtn);
          setTimeout(() => {
            publishApp(sender, message);
          }, 8000);
        }, 4000);
      }, 4000);
    }, 4000);
  }, 8000);
}

function inputConsent(sender, message) {
  tempSender = sender;
  tempMessage = message;
  setTimeout(() => {
    const external = document.getElementsByClassName("mat-radio-label")[1];
    triggerMouseClick(external);
    setTimeout(() => {
      const createConsent = getElementByAttributes(
        document.getElementsByTagName("button"),
        "type",
        "submit"
      );
      setTimeout(() => {
        triggerMouseClick(createConsent);

        setTimeout(() => {
          const consentName = document.getElementsByClassName(
            "mat-input-element"
          )[1];
          consentName.value = "rclone";
          consentName.setAttribute("value", "rclone");
          consentName.dispatchEvent(new Event("change", { bubbles: true }));
          consentName.dispatchEvent(new Event("blur", { bubbles: true }));
          consentName.dispatchEvent(new Event("input", { bubbles: true }));
          triggerMouseClick(consentName);
          consentName.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: "e",
              keyCode: 69,
              code: "KeyE",
              which: 69,
              shiftKey: false,
              ctrlKey: false,
              metaKey: false,
            })
          );
          setTimeout(() => {
            const menuSelect = getElementByAttributes(
              document.getElementsByTagName("ace-select"),
              "formcontrolname",
              "supportEmail"
            );
            triggerMouseClick(menuSelect);
            setTimeout(() => {
              const selectItem1 = document.getElementsByClassName(
                "mat-option mat-focus-indicator ng-star-inserted"
              )[0];
              triggerMouseClick(selectItem1);
              setTimeout(() => {
                const consentEmail = document.getElementsByClassName(
                  "mat-mdc-chip-input mat-mdc-input-element mdc-text-field__input mat-input-element"
                )[0];
                consentEmail.value = message.email;
                consentEmail.setAttribute("value", message.email);
                consentEmail.dispatchEvent(
                  new Event("change", { bubbles: true })
                );
                consentEmail.dispatchEvent(
                  new Event("blur", { bubbles: true })
                );
                consentEmail.dispatchEvent(
                  new Event("input", { bubbles: true })
                );
                const saveConsentBtn = document.getElementsByClassName(
                  "cfc-stepper-step-button cfc-stepper-step-continue-button"
                )[0];
                setTimeout(() => {
                  triggerMouseClick(saveConsentBtn);
                }, 2000);
                setTimeout(() => {
                  createTestUser(sender, message);
                }, 12000);
              }, 8000);
            }, 4000);
          }, 4000);
        }, 10000);
      }, 2000);
    }, 6000);
  }, 4000);
}

function enableConsent(sender, message) {
  console.log("enableConsent");
  IdFunction = "enableConsent";
  tempSender = sender;
  tempMessage = message;
  const credentialsLink = document.getElementById(
    "cfctest-section-nav-item-drive.googleapis.com/credentials"
  );
  setTimeout(() => {
    console.log(credentialsLink);
    credentialsLink.click();
    setTimeout(() => {
      console.log("note");
      const enableConsentBtn = getElementByAttributes(
        document.getElementsByClassName(
          "mat-focus-indicator mat-raised-button mat-button-base"
        ),
        "track-name",
        "navigateToConsentScreen"
      );
      triggerMouseClick(enableConsentBtn);
      setTimeout(() => {
        inputConsent(sender, message);
      }, 8000);
    }, 8000);
  }, 5000);
}

function enableDriveAPI(sender, message) {
  console.log("enableDriveAPI");
  IdFunction = "enableDriveAPI";
  tempSender = sender;
  tempMessage = message;
  const APIBtn = getElementByAttributes(
    document.getElementsByClassName(
      "cfc-info-card-item cfc-info-card-redirect cfc-button-small"
    ),
    "track-name",
    "graphCardApiCtaLink"
  );
  triggerMouseClick(APIBtn);
  setTimeout(() => {
    const enableAPIBtn = getElementByAttributes(
      document.getElementsByClassName(
        "mat-focus-indicator mat-button mat-button-base mat-primary"
      ),
      "track-name",
      "gotoLibrary"
    );
    setTimeout(() => {
      triggerMouseClick(enableAPIBtn);
      setTimeout(() => {
        const driveBtn = getElementIncludesAttribute(
          document.getElementsByTagName("a"),
          "href",
          "/apis/library/drive.googleapis.com"
        );
        console.log(driveBtn);
        setTimeout(() => {
          driveBtn.click();
          triggerMouseClick(driveBtn);
          setTimeout(() => {
            const enableBtn = document.getElementsByClassName(
              "mat-focus-indicator mat-raised-button mat-button-base mat-primary ace-tooltip-disable-user-select-on-touch-device ng-star-inserted"
            )[1];
            triggerMouseClick(enableBtn);
          }, 8000);
        }, 2000);
      }, 12000);
    }, 4000);
  }, 12000);
}

function newProject(sender, message) {
  console.log("newProject");
  IdFunction = "newProject";
  tempSender = sender;
  tempMessage = message;
  const infoButton = document.getElementsByClassName(
    "cfc-switcher-button mat-focus-indicator mat-button mat-button-base gm1-switcher-button"
  )[0];
  triggerMouseClick(infoButton);

  setTimeout(() => {
    const selectBtn = document.getElementById(
      "p6ntest-organization-switcher-menu"
    );
    if (selectBtn) {
      triggerMouseClick(selectBtn);
      setTimeout(() => {
        const select = document.getElementsByTagName("cfc-menu-item")[0];
        select.click();
        setTimeout(() => {
          const createMewProjectButton = document.getElementsByClassName(
            "purview-picker-create-project-button mat-focus-indicator mat-button mat-button-base mat-secondary ng-star-inserted"
          )[0];
          triggerMouseClick(createMewProjectButton);
          setTimeout(() => {
            const projectNameInput = document.getElementById(
              "p6ntest-name-input"
            );
            projectNameInput.value = "Gmail clone";
            setTimeout(() => {
              const createBtn = document.getElementsByClassName(
                "projtest-create-form-submit mat-focus-indicator mat-raised-button mat-button-base mat-primary"
              )[0];
              triggerMouseClick(createBtn);
              setTimeout(() => {
                const selectProjectBtn = document.getElementsByClassName(
                  "cfc-notification-action-button mat-focus-indicator mat-button"
                )[0];
                triggerMouseClick(selectProjectBtn);
                const hideNotification = getElementByAttributes(
                  document.getElementsByTagName("button"),
                  "aria-label",
                  "Open notifications"
                );
                setTimeout(() => {
                  triggerMouseClick(hideNotification);
                }, 2000);
                setTimeout(() => {
                  enableDriveAPI(sender, message);
                }, 14000);
              }, 14000);
            }, 4000);
          }, 4000);
        }, 8000);
      }, 4000);
    } else {
      setTimeout(() => {
        const createMewProjectButton = document.getElementsByClassName(
          "purview-picker-create-project-button mat-focus-indicator mat-button mat-button-base mat-secondary ng-star-inserted"
        )[0];
        triggerMouseClick(createMewProjectButton);
        setTimeout(() => {
          const projectNameInput = document.getElementById(
            "p6ntest-name-input"
          );
          projectNameInput.value = "Gmail clone";
          setTimeout(() => {
            const createBtn = document.getElementsByClassName(
              "projtest-create-form-submit mat-focus-indicator mat-raised-button mat-button-base mat-primary"
            )[0];
            triggerMouseClick(createBtn);
            setTimeout(() => {
              const selectProjectBtn = document.getElementsByClassName(
                "cfc-notification-action-button mat-focus-indicator mat-button"
              )[0];
              triggerMouseClick(selectProjectBtn);
              const hideNotification = getElementByAttributes(
                document.getElementsByTagName("button"),
                "aria-label",
                "Open notifications"
              );
              setTimeout(() => {
                triggerMouseClick(hideNotification);
              }, 2000);
              setTimeout(() => {
                enableDriveAPI(sender, message);
              }, 14000);
            }, 14000);
          }, 4000);
        }, 4000);
      }, 8000);
    }
  }, 4000);
}

function getInfo(sender, message) {
  console.log("getInfo");
  IdFunction = "getInfo";
  tempSender = sender;
  tempMessage = message;
  let agreeBtn = document.getElementsByClassName("mat-checkbox-layout")[0];
  if (document.getElementsByClassName("mat-checkbox-layout")[2]) {
    agreeBtn = document.getElementsByClassName("mat-checkbox-layout")[2];
  }
  setTimeout(() => {
    triggerMouseClick(agreeBtn);
    setTimeout(() => {
      const saveBtn = document.getElementsByClassName(
        "mat-focus-indicator mat-button mat-button-base mat-primary"
      )[2];
      triggerMouseClick(saveBtn);
      setTimeout(() => {
        newProject(sender, message);
      }, 8000);
    }, 4000);
  }, 500);
}

const messagesFromReactAppListener = (message, sender) => {
  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    message.action === "newlogin"
  ) {
    setTimeout(() => {
      loginGoogle(sender, message);
    }, 5000);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    message.action === "createTestUser"
  ) {
    setTimeout(() => {
      createTestUser(sender, message);
    }, 4000);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    message.action === "enableConsent"
  ) {
    setTimeout(() => {
      enableConsent(sender, message);
    }, 5000);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    message.action === "enableAPI"
  ) {
    setTimeout(() => {
      enableDriveAPI(sender, message);
    }, 5000);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    message.action === "createCredentials"
  ) {
    setTimeout(() => {
      createCredentials(sender, message);
    }, 5000);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    message.action === "automate"
  ) {
    setTimeout(() => {
      getInfo(sender, message);
    }, 20000);
  }

  if (sender.id === chrome.runtime.id && message.action === "getAccessToken") {
    setTimeout(() => {
      getCode(sender, message);
    }, 5000);
  }
  if (sender.id === chrome.runtime.id && message.action === "continue") {
    setTimeout(() => {
      continueWarning(sender, message);
    }, 4000);
  }
  if (sender.id === chrome.runtime.id && message.action === "allow") {
    setTimeout(() => {
      allowConsent(sender, message);
    }, 4000);
  }
  if (sender.id === chrome.runtime.id && message.action === "allowAccess") {
    setTimeout(() => {
      allowAccess(sender, message);
    }, 4000);
  }
  if (sender.id === chrome.runtime.id && message.action === "allowSummary") {
    setTimeout(() => {
      allowSummary(sender, message);
    }, 4000);
  }
  if (
    sender.id === chrome.runtime.id &&
    message.action === "allowSummaryVer2"
  ) {
    setTimeout(() => {
      allowSummaryVer2(sender, message);
    }, 4000);
  }

  if (sender.id === chrome.runtime.id && message.action === "continueLogin") {
    setTimeout(() => {
      continueLogin(sender, message);
    }, 4000);
  }
  if (sender.id === chrome.runtime.id && message.action === "getAccountInfo") {
    setTimeout(() => {
      getAccountInfo(sender, message);
    }, 4000);
  }
  if (
    sender.id === chrome.runtime.id &&
    message.action === "changePasswordAuth"
  ) {
    setTimeout(() => {
      changePasswordAuth(sender, message);
    }, 4000);
  }
  if (sender.id === chrome.runtime.id && message.action === "changePassword") {
    setTimeout(() => {
      changePassword(sender, message);
    }, 4000);
  }

  if (sender.id === chrome.runtime.id && message.action === "erroredAccount") {
    setTimeout(() => {
      handleDeletedAccount(sender, message);
    }, 4000);
  }

  if (sender.id === chrome.runtime.id && message.action === "continueConsole") {
    setTimeout(() => {
      continueConsole(sender, message);
    }, 4000);
  }
  if (sender.id === chrome.runtime.id && message.action === "continueDanger") {
    setTimeout(() => {
      continueDanger(sender, message);
    }, 4000);
  }
  if (sender.id === chrome.runtime.id && message.action === "continueCurrent") {
    setTimeout(() => {
      continueCurrent(sender, message);
    }, 30000);
  }
  if (
    sender.id === chrome.runtime.id &&
    message.action === "continueRecoverEmail"
  ) {
    setTimeout(() => {
      continueRecoveryEmail(sender, message);
    }, 10000);
  }
  if (
    sender.id === chrome.runtime.id &&
    message.action === "inputRecoveryEmail"
  ) {
    setTimeout(() => {
      inputRecoveryEmail(sender, message);
    }, 10000);
  }
  if (
    sender.id === chrome.runtime.id &&
    message.action === "createNewPassword"
  ) {
    setTimeout(() => {
      createNewPassword(sender, message);
    }, 5000);
  }

  if (
    sender.id === chrome.runtime.id &&
    message.action === "speedBumpNewPassword"
  ) {
    setTimeout(() => {
      speedBumpNewPassword(sender, message);
    }, 5000);
  }

  if (
    sender.id === chrome.runtime.id &&
    message.action === "continueNewPassword"
  ) {
    setTimeout(() => {
      continueNewPassword(sender, message);
    }, 5000);
  }
  if (
    sender.id === chrome.runtime.id &&
    message.action === "continueRecoveryOptions"
  ) {
    setTimeout(() => {
      continueRecoveryOptions(sender, message);
    }, 5000);
  }
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  messagesFromReactAppListener(request, sender);
  sendResponse(true);
});

setTimeout(() => {
  triggerStepIdByInterval();
}, 450000);

console.log("foreground loaded");
