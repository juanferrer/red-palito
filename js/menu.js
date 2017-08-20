class Menu{

    /**
    * Show menu if it's hidden
    * @param {string} type 
    */
   static showMenu(type) {
       switch (type.toLowerCase()) {
           case "main":
               document.getElementById("main-menu").style.visibility = "visible";
               document.getElementById("pause-menu").style.visibility = "hidden";
               break;
           case "pause":
               document.getElementById("main-menu").style.visibility = "hidden";
               document.getElementById("pause-menu").style.visibility = "visible";
               break;
           case "end":
               break;  
       }
       Menu.isShowingMenu = true;
   }
   
   /**
    * Hide menu if it's visible
    * @param {string} type 
    */
   static hideMenu() {
       document.getElementById("main-menu").style.visibility = "hidden";
       document.getElementById("pause-menu").style.visibility = "hidden";
       Menu.isShowingMenu = false;
   }
}

Menu.isShowingMenu = false;
Menu.isMainMenu = true;