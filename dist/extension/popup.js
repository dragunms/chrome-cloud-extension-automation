console.log("Test");

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to.
  const copyFrom = document.createElement("textarea");

  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;

  //Append the textbox field into the body as a child.
  //"execCommand()" only works when there exists selected text, and the text is inside
  //document.body (meaning the text is part of a valid rendered HTML element).
  document.body.appendChild(copyFrom);

  //Select all the text!
  copyFrom.select();

  //Execute command
  document.execCommand("copy");

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}
//
// async function openDirectory() {
//   const handle = await window.showDirectoryPicker();
//   const files = [];
//   for await (const entry of handle.values()) {
//     const file = await entry.getFile();
//     files.push(file);
//   }
//   return files;
// }
//
// function setPassword(password) {
//   chrome.runtime.sendMessage(
//     {
//       action: "setPassword",
//       password: password,
//     },
//     function (response) {}
//   );
// }
//
// document.addEventListener("DOMContentLoaded", function () {
//   let button = document.getElementById("get_file");
//
//   button.onclick = function () {
//     openDirectory();
//   };
// });
//
// document.addEventListener("DOMContentLoaded", function () {
//   let button = document.getElementById("get_password");
//
//   button.onclick = function () {
//     const password = document.getElementById("password").value;
//     setPassword(password);
//   };
// });

document.addEventListener("DOMContentLoaded", function () {
  let input = document.getElementById("input-file");
  let exportButton = document.getElementById("export_rclone");
  let runRcloneButton = document.getElementById(
    "run_rclone_tool_keep_password"
  );

  exportButton.onclick = function () {
    exportRclone();
  };
  runRcloneButton.onclick = function () {
    runRcloneToolKeepPassword();
  };
  input.onchange = function () {
    console.log("onchange");
    loadFileAsText();
  };
});

function runRcloneToolKeepPassword() {
  chrome.runtime.sendMessage(
    {
      action: "runRcloneToolKeepPassword",
    },
    function (response) {}
  );
}

function exportRclone() {
  chrome.runtime.sendMessage(
    {
      action: "exportRclone",
    },
    function (response) {}
  );
}

function loadFileAsText() {
  const fileToLoad = document.getElementById("input-file").files[0];

  let value = "";
  const fileReader = new FileReader();
  fileReader.onload = async function (fileLoadedEvent) {
    const textFromFileLoaded = await fileLoadedEvent.target.result;
    value = await parseText(textFromFileLoaded);

    setTimeout(() => {
      chrome.runtime.sendMessage(
        {
          action: "importConfig",
          values: value,
        },
        function (response) {}
      );
    }, 4000);
  };

  fileReader.readAsText(fileToLoad, "UTF-8");
}

function trimString(str = "") {
  return str.trim();
}

function parseTokenValues(str = "") {
  let value = [];
  const tokenStrValuesStr = str.split("=").pop().trim().split(",");
  for (let i = 0; i < tokenStrValuesStr.length; i++) {
    value.push(tokenStrValuesStr[i].split('":"').pop());
  }
  value[0] = value[0].replace('"', "");
  value[2] = value[2].replace('"', "");
  value[3] = value[3].replace('"}', "");
  return value;
}

function trimmedStringList(values) {
  let trimmedList = values.filter((e) => e);
  trimmedList = trimmedList.filter((e) => !e.includes("team_drive"));
  trimmedList = trimmedList.filter((e) => !e.includes("root_folder_id"));
  return trimmedList;
}

function parseText(input = "") {
  let char = "\n";
  let unTrimmedStrList = input.split(char);
  let strList = trimmedStringList(unTrimmedStrList);
  const spacing = 7;
  let valueList = [];
  for (let i = 0; i < strList.length; i += spacing) {
    if (i + spacing <= strList.length) {
      const rcloneIndex = trimString(strList[i]).substring(
        1,
        trimString(strList[i]).length - 1
      );
      const clientId = strList[i + 2].split("=").pop().trim();

      const clientSecret = strList[i + 3].split("=").pop().trim();
      const tokenValues = parseTokenValues(strList[i + 5]);
      const accessToken = tokenValues[0];
      const refreshToken = tokenValues[2];
      const expiry = tokenValues[3];
      valueList.push([
        clientId,
        clientSecret,
        accessToken,
        refreshToken,
        expiry,
        rcloneIndex,
      ]);
    }
  }
  return valueList;
}
