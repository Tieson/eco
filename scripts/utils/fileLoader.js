function fileLoader(file){
    try{
      xmlhttp=new XMLHttpRequest();
      xmlhttp.open("GET",file,false);
      xmlhttp.send();
      return xmlhttp.responseText;
    }catch(e){
        alert("Soubor " + file + " nemohu nalézt a otevřít!");
    }
}