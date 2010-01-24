var XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
var XHTML_NS = "http://www.w3.org/1999/xhtml";

var domainswitch = {
	initialized: false,
	
	onLoad: function() {
		if(!this.initialized) {
			// initialization code
			this.prefs = domainswitch_prefs;
			this.prefs.initialize(this); //add this as a prefs observer
			
			//check if this is the first run of a new version
			if(this.prefs.getPref('version') != '0.1') {
				this.prefs.setPref('version', '0.1');
			}		
			
			this.initialize();
			this.initialized = true;
		}
	},

	onConfigure: function()
	{
		var winOptions = openDialog('chrome://domainswitch/content/domainswitch-options-overlay.xul', 
					'domainswitch-options', 
					'centerscreen,chrome,resizable,dialog=no');
		try {
			winOptions.focus();
		} catch (ex) {
		}
	},
		
	initialize: function()
	{
		this.initToolbarButton();
		this.initToolbar();
		
		var domains = this.prefs.getPref('domains').split(',');
		
		for(var i in domains) {
			var domain = domains[i];
			if(domain != "") {
				this.addDomainButton(domains[i]);
				this.addDomainToolbarMenuitem(domains[i]);
			}
		}
	},
	
	initToolbarButton: function()
	{
		var button = document.getElementById('domainswitch-button');
		button.setAttribute('disabled', 'true');
		
		var menupopup = document.getElementById('domainswitch-button-menu');
		while(menupopup.hasChildNodes()){
			menupopup.removeChild(menupopup.firstChild);
		}
	},
	
	initToolbar: function()
	{
		var domains = document.getElementById('domainswitch-toolbar-domains');
		while(domains.hasChildNodes()){
			domains.removeChild(domains.firstChild);
		}
	},	
	
	addDomainToolbarMenuitem: function(domain)
	{
		var menu = document.getElementById('domainswitch-button-menu');
		
		var button = document.getElementById('domainswitch-button');
		button.setAttribute('disabled', 'false');
		
		var menuitem = document.createElement('menuitem');
		menuitem.setAttribute('label', domain);
		menuitem.setAttribute('class', 'menuitem-iconic');
		menuitem.setAttribute('tooltiptext', 'Switch to ' + domain);
		menuitem.setAttribute('image', 'chrome://domainswitch/skin/icon_16x16.png');
		menuitem.setAttribute('oncommand', 'domainswitch.switchTo("' + domain + '");');
		
		menu.appendChild(menuitem);	
	},

	addDomainButton: function(domain)
	{
		var toolbar = document.getElementById('domainswitch-toolbar-domains');
		
		var button = document.createElement('toolbarbutton');
		button.setAttribute('label', domain);
		button.setAttribute('tooltiptext', 'Switch to ' + domain);
		button.setAttribute('image', 'chrome://domainswitch/skin/icon_16x16.png');		
		button.setAttribute('oncommand', 'domainswitch.switchTo("' + domain + '");');
		
		toolbar.appendChild(button);
	},
	
	switchTo: function(domain)
	{
		var cur_url = content.document.location + '';
		var path = cur_url.substr(cur_url.indexOf('/', 8));
		var url = 'http://' + domain + path;
		content.document.location = url;
	},
	
	observe: function()
	{
		this.initialize();
	},

};
window.addEventListener("load", function(e) { domainswitch.onLoad(e); }, false);