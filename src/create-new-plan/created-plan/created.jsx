function copy(){
      var copyText = document.getElementById("shareLink");

      copyText.select();
      copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(copyText.value);

      alert("Have a nice trip!");
}

