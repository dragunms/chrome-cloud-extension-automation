let clientId = "";
let secret = "";
let ApiKey = "";
let email = "";
let recoveryEmail = "";
let password = "";
let currentPassword = "";
let newPassword = "aAbB!@#123Cc";
let accountTab = null;
let consoleTab = null;
let accessCode = "";
let accessToken = "";
let expired = "";
let refreshToken = "";
let accessTokenExist = false;
let started = false;
let accountInfoIsChanged = false;
let accountList = [];
let rcloneList = [];
let importConfigValues = [];

let accountListIndex = 0;
let sheetClientId =
  "876330463341-a542nmr2mgtrv7ov9lli4ujdbovjkcn5.apps.googleusercontent.com";
let sheetId = "12oQBabPkfU2HOC4nqmDcxnOtOM-WOs7uRdeHMvxdJYI";
let sheetKey = "AIzaSyDS1B6LuN87FDpjFO86Nq6YckkLMp0i2YQ";
let sheetName = "Tool1";
let sheetSecret = "dvvWHO4iScejRxI1awDMrE6K";
let sheetAccessCode = "";
let sheetToken = "";
let sheetRefreshToken = "";
let importSheetId = "10Vkfw_ArJMgAyV-X3p_Oug2u6QPR62sprOy0FhKCRZc";
let importSheetName = "Sheet3";
let importSheetAccessCode = "";
let importSheetToken = "";
let importSheetRefreshToken = "";
let finished = false;
let changePassword = false;
let currentTaskId = "";
let currentTabId = "";

function getClientId() {
  return clientId;
}

function getAPIKey() {
  return ApiKey;
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function getRcloneList() {
  let spreadsheetId = sheetId;
  let range = sheetName;
  let Key = sheetKey;
  let init = {
    method: "GET",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      let str = "";
      console.log(data);
      rcloneList = data.values;
      for (let i = 1; i <= rcloneList.length; i++) {
        const index = i - 1;
        if (
          rcloneList[index][8] &&
          rcloneList[index][3] !== "" &&
          rcloneList[index][3] !== "PHONE" &&
          rcloneList[index][3] !== "ERROR" &&
          !rcloneList[index][3].includes("RUNNING")
        ) {
          if (rcloneList[index][9]) {
            str =
              str +
              `[${rcloneList[index][8]}] \ntype = drive \nclient_id = ${
                rcloneList[index][3]
              } \nclient_secret = ${
                rcloneList[index][4]
              } \nscope = drive \ntoken = {"access_token":"${
                rcloneList[index][5]
              }","token_type":"Bearer","refresh_token":"${
                rcloneList[index][6]
              }","expiry":"${moment()
                .subtract(1, "h")
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSSSZ")}"} \nteam_drive = ${
                rcloneList[index][9]
              } \nroot_folder_id = \n \n`;
          } else {
            str =
              str +
              `[${rcloneList[index][8]}] \ntype = drive \nclient_id = ${
                rcloneList[index][3]
              } \nclient_secret = ${
                rcloneList[index][4]
              } \nscope = drive \ntoken = {"access_token":"${
                rcloneList[index][5]
              }","token_type":"Bearer","refresh_token":"${
                rcloneList[index][6]
              }","expiry":"${moment()
                .subtract(1, "h")
                .format("YYYY-MM-DDTHH:mm:ss.SSSSSSSZ")}"} \n \n`;
          }
        }
        if (i === rcloneList.length) {
          download("rclone.txt", str);
        }
      }
    });
}

function getCellValue(token) {
  if (accountListIndex <= accountList.length) {
    if (
      accountList[accountListIndex - 1][0] &&
      accountList[accountListIndex - 1][1] &&
      accountList[accountListIndex - 1][2]
    ) {
      email = accountList[accountListIndex - 1][0];
      password = accountList[accountListIndex - 1][1];
      recoveryEmail = accountList[accountListIndex - 1][2];
      currentPassword = password;
      console.log(`Row ${accountListIndex}: ${email} ${password}`);
      if (!accountList[accountListIndex - 1][3]) {
        if (email !== "" && email) {
          setTimeout(() => {
            chrome.windows.create({
              url: "https://accounts.google.com",
              incognito: true,
              state: "maximized",
            });
            markRunning();
          }, 10000);
        }
      } else {
        newAccount();
      }
    } else if (
      accountList[accountListIndex - 1][0] &&
      accountList[accountListIndex - 1][1] &&
      !accountList[accountListIndex - 1][2]
    ) {
      newAccount();
    } else {
      newAccount();
    }
  } else {
    finished = true;
    alert("Finished");
  }
}

function updatePassword() {
  let spreadsheetId = sheetId;
  let range = `${sheetName}!B${accountListIndex}`;
  let Key = sheetKey;
  currentPassword = newPassword;
  const body = {
    range: `${sheetName}!B${accountListIndex}`,
    majorDimension: "ROWS",
    values: [[newPassword]],
  };

  let init = {
    method: "PUT",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
    body: JSON.stringify(body),
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(`Password is changed to: ${newPassword}`);
    });
}

function markRunning(message = "RUNNING") {
  let spreadsheetId = sheetId;
  let range = `${sheetName}!D${accountListIndex}`;
  let Key = sheetKey;
  message = `${message} - ${sheetName} - ${moment().format("LLL").toString()}`;
  const body = {
    range: `${sheetName}!D${accountListIndex}`,
    majorDimension: "ROWS",
    values: [[message]],
  };

  let init = {
    method: "PUT",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
    body: JSON.stringify(body),
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {});
}

function markError(error = "ERROR") {
  let spreadsheetId = sheetId;
  let range = `${sheetName}!D${accountListIndex}`;
  let Key = sheetKey;

  const body = {
    range: `${sheetName}!D${accountListIndex}`,
    majorDimension: "ROWS",
    values: [[error]],
  };

  let init = {
    method: "PUT",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
    body: JSON.stringify(body),
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      accessTokenExist = false;
      accountInfoIsChanged = false;
      started = false;
      email = "";
      recoveryEmail = "";
      password = "";
      accessCode = "";
      accessToken = "";
      expired = "";
      refreshToken = "";
      clientId = "";
      secret = "";
      ApiKey = "";
      getAccountList();
    });
}

function newAccount() {
  accountListIndex = accountListIndex + 1;
  setTimeout(() => {
    getCellValue();
  }, 300);
}

function getSheetRcloneDataAccess(tab, tabId) {
  sheetAccessCode = tab.url.split("&")[1].replace("code=", "");
  const req = new XMLHttpRequest();
  const baseUrl = "https://oauth2.googleapis.com/token";
  const urlParams = `code=${sheetAccessCode}&client_id=${sheetClientId}&client_secret=${sheetSecret}&redirect_uri=https://example.org&grant_type=authorization_code`;

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(urlParams);

  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.stringify(this.response);
      setTimeout(() => {
        if (response) {
          console.log(response);
          const tempAccessToken = response.split(",")[0].split(":")[1].slice(1);
          sheetToken = tempAccessToken.slice(2, tempAccessToken.length - 2);
          getRcloneList();
          setTimeout(() => {
            chrome.tabs.remove(tabId);
          }, 6000);
        }
      }, 2000);
    }
  };
}

function getDataAccess(tab, tabId) {
  accessCode = tab.url.split("&")[1].replace("code=", "");
  const req = new XMLHttpRequest();
  const baseUrl = "https://oauth2.googleapis.com/token";
  const urlParams = `code=${accessCode}&client_id=${clientId}&client_secret=${secret}&redirect_uri=https://example.com&grant_type=authorization_code`;

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(urlParams);

  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.stringify(this.response);
      setTimeout(() => {
        if (response) {
          console.log(response);
          const tempAccessToken = response.split(",")[0].split(":")[1].slice(1);
          accessToken = tempAccessToken.slice(2, tempAccessToken.length - 2);
          expired = response.split(",")[1].split(":")[1];
          const tempRefreshToken = response.split(",")[2].split(":")[1];
          refreshToken = tempRefreshToken.slice(3, tempRefreshToken.length - 2);

          accessTokenExist = true;
          chrome.windows.create({
            url: "https://docs.google.com/spreadsheets",
            incognito: false,
            state: "maximized",
          });
          setTimeout(() => {
            chrome.tabs.remove(tabId);
          }, 6000);
        }
      }, 2000);
    }
  };
}

function importConfig(value = "") {
  let spreadsheetId = importSheetId;
  let range = `${importSheetName}!D2:I2`;
  let Key = sheetKey;

  const body = {
    range: `${importSheetName}!D2:I2`,
    majorDimension: "ROWS",
    values: [...value],
  };

  let init = {
    method: "POST",
    async: true,
    headers: {
      Authorization: "Bearer " + importSheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
    body: JSON.stringify(body),
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
    });
}

function getImportSheetAccess(tab, tabId) {
  importSheetAccessCode = tab.url.split("&")[1].replace("code=", "");
  const req = new XMLHttpRequest();
  const baseUrl = "https://oauth2.googleapis.com/token";
  const urlParams = `code=${importSheetAccessCode}&client_id=${sheetClientId}&client_secret=${sheetSecret}&redirect_uri=https://example.edu&grant_type=authorization_code`;

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(urlParams);

  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.stringify(this.response);
      setTimeout(() => {
        if (response) {
          console.log(response);
          const tempAccessToken = response.split(",")[0].split(":")[1].slice(1);
          importSheetToken = tempAccessToken.slice(
            2,
            tempAccessToken.length - 2
          );
          importConfig(importConfigValues);
          setTimeout(() => {
            chrome.tabs.remove(tabId);
          }, 6000);
        }
      }, 2000);
    }
  };
}

function getSheetDataAccess(tab, tabId) {
  sheetAccessCode = tab.url.split("&")[1].replace("code=", "");
  const req = new XMLHttpRequest();
  const baseUrl = "https://oauth2.googleapis.com/token";
  const urlParams = `code=${sheetAccessCode}&client_id=${sheetClientId}&client_secret=${sheetSecret}&redirect_uri=https://example.net&grant_type=authorization_code`;

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(urlParams);

  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.stringify(this.response);
      setTimeout(() => {
        if (response) {
          console.log(response);
          const tempAccessToken = response.split(",")[0].split(":")[1].slice(1);
          sheetToken = tempAccessToken.slice(2, tempAccessToken.length - 2);
          const tempRefreshToken = response.split(",")[2].split(":")[1];
          sheetRefreshToken = tempRefreshToken.slice(
            3,
            tempRefreshToken.length - 2
          );
          console.log(sheetRefreshToken);
          getAccountList();
          setTimeout(() => {
            chrome.tabs.remove(tabId);
          }, 6000);
        }
      }, 2000);
    }
  };
}

function refreshSheetDataAccess() {
  const req = new XMLHttpRequest();
  const baseUrl = "https://oauth2.googleapis.com/token";
  const urlParams = `client_id=${sheetClientId}&client_secret=${sheetSecret}&refresh_token=${sheetRefreshToken}&grant_type=refresh_token`;

  req.open("POST", baseUrl, true);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(urlParams);

  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      const response = JSON.stringify(this.response);
      setTimeout(() => {
        if (response) {
          console.log(response);
          const tempAccessToken = response.split(",")[0].split(":")[1].slice(1);
          sheetToken = tempAccessToken.slice(2, tempAccessToken.length - 2);
        }
      }, 2000);
    }
  };
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (
    changeInfo.status === "complete" &&
    !finished &&
    currentTaskId !== "" &&
    currentTabId === tabId
  ) {
    chrome.tabs.sendMessage(
      tabId,
      {
        action: "continueCurrent",
        tab,
        task_id: currentTaskId,
        email: email,
        password: password,
        change_password: changePassword,
        new_password: newPassword,
      },
      function () {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/challenge/ipe") &&
    !finished
  ) {
    markError("WRONG PASSWORD");
    setTimeout(() => {
      chrome.tabs.remove(tabId);
    }, 6000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/challenge/selection") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      {
        action: "continueRecoverEmail",
        tab,
        email: email,
        password: password,
        recovery_email: recoveryEmail,
        new_password: newPassword,
      },
      function (response) {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/challenge/kpe") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      {
        action: "inputRecoveryEmail",
        tab,
        email: email,
        password: password,
        recovery_email: recoveryEmail,
        new_password: newPassword,
      },
      function (response) {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("myaccount.google.com") &&
    !finished
  ) {
    setTimeout(() => {
      if (!accountInfoIsChanged) {
        chrome.tabs.create({
          url: "https://myaccount.google.com/personal-info",
        });
        accountInfoIsChanged = true;
        setTimeout(() => {
          chrome.tabs.remove(tabId);
        }, 3000);
      }
    }, 3000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("console.cloud.google.com/home/dashboard") &&
    !finished
  ) {
    accountInfoIsChanged = false;
    consoleTab = tab;
    setTimeout(() => {
      if (!started) {
        chrome.tabs.sendMessage(
          tabId,
          { action: "automate", tab, email: email },
          function () {}
        );
        started = true;
      }
    }, 2000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/identifier") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "newlogin", tab, email: email, password: password },
      function (response) {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes(
      "myaccount.google.com/signinoptions/recovery-options-collection"
    ) &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      {
        action: "continueRecoveryOptions",
        tab,
        recovery_email: recoveryEmail,
        email: email,
        password: password,
      },
      function (response) {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("myaccount.google.com/personal-info") &&
    !finished
  ) {
    accountTab = tab;
    chrome.tabs.sendMessage(
      tabId,
      {
        action: "getAccountInfo",
        tab,
        email: email,
        password: password,
        change_password: changePassword,
      },
      function (response) {}
    );
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes(
      "accounts.google.com/ServiceLogin/webreauth?service=cloudconsole"
    ) &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "continueConsole", tab },
      function (response) {}
    );
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("myaccount.google.com/signinoptions/password") &&
    !finished
  ) {
    accountTab = tab;
    if (newPassword === "") {
      alert("new password has not been set");
    } else {
      chrome.tabs.sendMessage(
        tabId,
        {
          action: "changePassword",
          tab,
          email: email,
          password: password,
          new_password: newPassword,
        },
        function (response) {}
      );
    }
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/challenge/pwd") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "changePasswordAuth", tab, email: email, password: password },
      function (response) {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/speedbump/idvreenable") &&
    !finished
  ) {
    markError("PHONE");
    setTimeout(() => {
      chrome.tabs.remove(tabId);
    }, 6000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/challenge/iap") &&
    !finished
  ) {
    markError("PHONE");
    setTimeout(() => {
      chrome.tabs.remove(tabId);
    }, 6000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/oauth/danger") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "continueDanger", tab },
      function (response) {}
    );
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/disabled") &&
    !finished
  ) {
    markError();
    setTimeout(() => {
      chrome.tabs.remove(tabId);
    }, 6000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("gds.google.com/web/chip") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "continueLogin", tab },
      function (response) {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("console.cloud.google.com/getting-started") &&
    !finished
  ) {
    accountInfoIsChanged = false;
    consoleTab = tab;
    setTimeout(() => {
      if (!started) {
        chrome.tabs.sendMessage(
          tabId,
          { action: "automate", tab, email: email, password: password },
          function () {}
        );
        started = true;
      }
    }, 2000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/changepassword") &&
    !finished
  ) {
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tabId,
        {
          action: "createNewPassword",
          tab,
          email: email,
          password: password,
          new_password: newPassword,
        },
        function () {}
      );
    }, 2000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/speedbump/gaplustos") &&
    !finished
  ) {
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tabId,
        {
          action: "continueNewPassword",
          tab,
          email: email,
          password: password,
          new_password: newPassword,
        },
        function () {}
      );
    }, 2000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/speedbump/changepassword") &&
    !finished
  ) {
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tabId,
        {
          action: "speedBumpNewPassword",
          tab,
          email: email,
          password: password,
          new_password: newPassword,
        },
        function () {}
      );
    }, 2000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes(
      "console.cloud.google.com/apis/api/drive.googleapis.com/overview"
    ) &&
    !finished
  ) {
    setTimeout(() => {
      chrome.tabs.sendMessage(
        tabId,
        { action: "enableConsent", tab, email: email, password: password },
        function () {}
      );
    }, 2000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/o/oauth2/v2/auth") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "getAccessToken", tab },
      function () {}
    );
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/v2/deleted_account") &&
    !finished
  ) {
    markError();
    setTimeout(() => {
      chrome.tabs.remove(tabId);
    }, 6000);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/oauth/warning") &&
    !finished
  ) {
    chrome.tabs.sendMessage(tabId, { action: "continue", tab }, function () {});
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes(
      "accounts.google.com/signin/oauth/consent/oauthchooseaccount"
    ) &&
    !finished
  ) {
    chrome.tabs.sendMessage(tabId, { action: "allow", tab }, function () {});
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/oauth/consent") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "allowAccess", tab },
      function () {}
    );
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/oauth/consentsummary") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "allowSummary", tab },
      function () {}
    );
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("accounts.google.com/signin/oauth/v2/consentsummary") &&
    !finished
  ) {
    chrome.tabs.sendMessage(
      tabId,
      { action: "allowSummaryVer2", tab },
      function () {}
    );
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("example.com/?state=1&code=") &&
    !finished
  ) {
    getDataAccess(tab, tabId);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("example.edu/?state=1&code=") &&
    !finished
  ) {
    getImportSheetAccess(tab, tabId);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("example.net/?state=1&code=") &&
    !finished
  ) {
    getSheetDataAccess(tab, tabId);
  }

  if (
    changeInfo.status === "complete" &&
    tab.url.includes("example.org/?state=1&code=") &&
    !finished
  ) {
    getSheetRcloneDataAccess(tab, tabId);
  }
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("docs.google.com/spreadsheets") &&
    !finished &&
    accessTokenExist === true
  ) {
    getToken();
    setTimeout(() => {
      chrome.tabs.remove(tabId);
    }, 6000);
  }
});

function getToken() {
  let spreadsheetId = sheetId;
  let range = `${sheetName}!A${accountListIndex}:H${accountListIndex}`;
  let Key = sheetKey;

  const body = {
    range: `${sheetName}!A${accountListIndex}:H${accountListIndex}`,
    majorDimension: "ROWS",
    values: [
      [
        email,
        currentPassword,
        recoveryEmail,
        clientId,
        secret,
        accessToken,
        refreshToken,
        expired,
      ],
    ],
  };

  let init = {
    method: "PUT",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
    body: JSON.stringify(body),
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED&key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      console.log(data);
      accessTokenExist = false;
      accountInfoIsChanged = false;
      started = false;
      email = "";
      recoveryEmail = "";
      password = "";
      accessCode = "";
      accessToken = "";
      expired = "";
      refreshToken = "";
      clientId = "";
      secret = "";
      ApiKey = "";
      getAccountList();
    });
}

function getAccountList(token) {
  let spreadsheetId = sheetId;
  let range = sheetName;
  let Key = sheetKey;
  let init = {
    method: "GET",
    async: true,
    headers: {
      Authorization: "Bearer " + sheetToken,
      "Content-Type": "application/json",
    },
    contentType: "json",
  };

  fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${Key}`,
    init
  )
    .then((response) => response.json())
    .then(function (data) {
      if (accountList.length !== data.values.length) {
        accountListIndex = 0;
      }
      accountList = data.values;
      console.log(accountList);
      newAccount();
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    request.action === "getValue"
  ) {
    clientId = request.client_id;
    secret = request.client_secret;
    console.log(clientId);
    console.log(secret);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    request.action === "wrongPassword"
  ) {
    markError("WRONG PASSWORD");
    setTimeout(() => {
      chrome.tabs.remove(request.tab.id);
    }, 6000);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    request.action === "accountNotExist"
  ) {
    markError("ACCOUNT DOES NOT EXIST");
    setTimeout(() => {
      chrome.tabs.remove(request.tab.id);
    }, 6000);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    request.action === "getRecoveryEmail"
  ) {
    recoveryEmail = request.recovery_email;
    console.log(recoveryEmail);
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    request.action === "getAPIKey"
  ) {
    ApiKey = request.API_key;

    setTimeout(() => {
      chrome.tabs.create({
        url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/drive&include_granted_scopes=true&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://example.com&client_id=${clientId}`,
      });
      setTimeout(() => {
        chrome.tabs.remove(consoleTab.id);
      }, 6000);
    }, 2000);
  }

  if (
    // eslint-disable-next-line no-undef
    request.action === "storeCurrentTaskId"
  ) {
    currentTaskId = request.task_id;
    currentTabId = request.tab_id;
    let code = "window.location.reload();";
    started = false;
    chrome.tabs.executeScript(request.tab_id, { code: code });
  }

  if (request.action === "importConfig") {
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://example.edu&client_id=${sheetClientId}`,
    });
    console.log(request.values);
    importConfigValues = request.values;
  }

  if (request.action === "runRcloneToolKeepPassword") {
    finished = false;
    accountListIndex = 0;
    changePassword = false;
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://example.net&client_id=${sheetClientId}`,
    });
    alert("automating");
    setInterval(function () {
      refreshSheetDataAccess();
    }, 2700000);
  }

  if (request.action === "exportRclone") {
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://example.org&client_id=${sheetClientId}`,
    });
    alert("get rclone List");
  }

  if (
    // eslint-disable-next-line no-undef
    sender.id === chrome.runtime.id &&
    request.action === "setupAccountConsoleCloud"
  ) {
    if (changePassword) {
      updatePassword();
    }
    chrome.tabs.create({
      url: "https://console.cloud.google.com/",
    });
    setTimeout(() => {
      chrome.tabs.remove(accountTab.id);
    }, 6000);
  }
  sendResponse(true);
});

chrome.contextMenus.create({
  title: "Get Account List (Change Password)",
  contexts: ["page"],
  id: "contextMenu1",
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  consoleTab = tab;

  if (info.menuItemId === "contextMenu1") {
    finished = false;
    accountListIndex = 0;
    changePassword = true;
    chrome.tabs.create({
      url: `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/spreadsheets&include_granted_scopes=true&prompt=consent&access_type=offline&response_type=code&state=1&flowName=GeneralOAuthFlow&redirect_uri=https://example.net&client_id=${sheetClientId}`,
    });
    alert("automating");
    setInterval(function () {
      refreshSheetDataAccess();
    }, 2700000);
  }
});
console.log("background loaded");
