var domainswitch_options = {

	onLoad: function()
	{
		this.prefs = domainswitch_prefs;
		this.prefs.initialize(this);
	},
	
	onOK: function()
	{
		this.saveTreeToPrefs();
	},
	
	onAdd: function()
	{
		var winOptions = openDialog('chrome://domainswitch/content/domainswitch-add-overlay.xul', 
					'domainswitch-add', 
					'centerscreen,chrome,resizable,dialog=no',
					this);
		try {
			winOptions.focus();
		} catch (ex) {
		}
	},
	
	onDelete: function()
	{
		var tree = document.getElementById('domainswitch-domains-tree');
		var children = document.getElementById('domainswitch-domains-tree-children');
		
		if(!tree || !tree.currentIndex) { return; }
		
		children.removeChild(children.childNodes[tree.currentIndex]);
	},
	
	onAddOK: function()
	{
		var ctx = window.arguments[0];
		var add_domain = document.getElementById('domainswitch-add-domain');
		ctx.addDomain(add_domain.value);
	},
	
	addDomain: function(domain)
	{
		var tree = document.getElementById('domainswitch-domains-tree-children');
		if(!tree || domain == "") { return; }
	
		var item = document.createElement('treeitem');
		var row = document.createElement('treerow');
		item.appendChild(row);
		
		var cell = document.createElement('treecell');
		cell.setAttribute('label', domain);
		row.appendChild(cell);
		
		tree.appendChild(item);	
	},
	
	populateDomainsTree: function()
	{
		var domains = this.prefs.getStringPref('domains').split(',');
		var tree = document.getElementById('domainswitch-domains-tree-children');
		if(!tree) { return; }
		
		while(tree.hasChildNodes()){
			tree.removeChild(tree.firstChild);
		}
		
		for(var i in domains) {
			this.addDomain(domains[i]);
		}
	},
	
	saveTreeToPrefs: function()
	{
		var children = document.getElementById('domainswitch-domains-tree-children').childNodes;
		if(!children) { return; }

		var domains = "";
		
		for(var i = 0; i < children.length; i++) {
			var columns = children[i].childNodes[0].childNodes;
			var str = columns[0].getAttribute('label');
			if(domains == "") {
				domains = str;
			} else {
				domains += ',' + str;
			}
		}
		
		this.prefs.setStringPref('domains', domains);
	},
	
	observe: function()
	{
		this.populateDomainsTree();
	}

};