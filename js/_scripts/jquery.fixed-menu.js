var menu = document.getElementById( "menu-wrapper" );

var wrapperWidth, tileWidth, tileHeight, tilesPerLine;
var countVisible, totalHeight;

var tileNodes  = document.querySelectorAll( ".tile.visible" ); // or .childElementCount; (IE >= 9), or querySelector and .children.length
var totalTiles = tileNodes.length;
var detailsHeight;

var tilesMatrix = [], tilesVisibleMatrix = [];
var setCol, setRow;


//////////////////////////////////////////////////////////////////
////////// FUNCTIONS /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

// sets the nav bar to fixed position when the user scrolls
//////////////////////////////////////////////////////////////////
function fixedMenu() {
	var menuBox = menu.getBoundingClientRect();
	if ( menuBox.top < -20 )  document.getElementById( "main-menu" ).classList.add( "fixed-menu" );
	else                      document.getElementById( "main-menu" ).classList.remove( "fixed-menu" );
}

// number of tiles per row
//////////////////////////////////////////////////////////////////
function tilesPerRow() {
	wrapperWidth = document.querySelector( "#tiles-wrapper" ).offsetWidth;
    tileWidth    = document.querySelector( ".visible" ).offsetWidth;
    tileHeight   = document.querySelector( ".visible" ).offsetHeight;
	tilesPerLine = Math.floor(wrapperWidth / tileWidth);
}

// tiles wrapper height
//////////////////////////////////////////////////////////////////
function tilesWrapperHeight(full) {
	tilesPerRow();
	countVisible = $( ".tile" ).not( ".hidden" ).size();
	totalHeight  = Math.ceil(countVisible / tilesPerLine) * tileHeight;
	// full height when details of a tile are displayed
	if (full) {
		totalHeight = totalHeight + detailsHeight;
	}
	$( "#tiles-wrapper" ).css( "height", totalHeight );
}

function matrix() {
	tileNodesVisible = document.querySelectorAll( ".tile.visible" );
	for (i = 0; i < tileNodesVisible.length; i++) {
		setRow = Math.floor(i / tilesPerLine);
		setCol = i % tilesPerLine;
		tilesMatrix.push({
			row: setRow,
			col: setCol
		});
	}
}

// tiles filtering
//////////////////////////////////////////////////////////////////
function moveTiles(category) {
	// adds/removes classes depending of the selected filter
	if (category === undefined)
		$( " .tile" ).removeClass( "hidden" ).addClass( "visible" ).fadeTo( 750, 1 );
	else {
		$( "#tiles-wrapper ." + category + "" ).addClass( "visible" ).removeClass( "hidden" ).fadeTo( 750, 1 );
		$( " .tile" ).not( "." + category + "" ).addClass( "hidden" ).removeClass( "visible" ).fadeTo( 750, 0 );
	}
	// moves tiles to new coordinates
	var counter = 0; // used to keep track of consecutive hidden tiles
	for (i = 0; i < tileNodes.length; i++) {
		if ( $( tileNodes[i] ).hasClass( "hidden" ) )
			counter += 1;
		else {
			var rowDiff = (tilesMatrix[i-counter].row - tilesMatrix[i].row) * 100,
			    colDiff = (tilesMatrix[i-counter].col - tilesMatrix[i].col) * 100;
			$( tileNodes[i] ).css( "transform", "translate("+ colDiff +"%,"+ rowDiff +"%)" );
		}
	}
	// sets the wrapper height accordingly
	tilesWrapperHeight();
}

// hide details
//////////////////////////////////////////////////////////////////
function hideDetails(tile) {
	$( ".details" ).removeClass( "displayed" );
	setTimeout(function() {
		$( tile ).css( "margin-bottom", 0 );
		tilesWrapperHeight();
	}, 750);
}

// show details
//////////////////////////////////////////////////////////////////
function showDetails(tile) {
	
}


//////////////////////////////////////////////////////////////////
////////// to perform when the document is ready /////////////////
//////////////////////////////////////////////////////////////////
document.addEventListener( 'DOMContentLoaded', function() {

	fixedMenu();
	tilesWrapperHeight();

	for (i = 0; i < tileNodes.length; i++) {
		setRow = Math.floor(i / tilesPerLine);
		setCol = i % tilesPerLine;
		tilesMatrix.push({
			row: setRow,
			col: setCol
		});
	}

	// checks if the nav bar position must change when the user scolls
	//////////////////////////////////////////////////////////////////
	window.addEventListener( 'scroll', function() {  fixedMenu();  });

	// tiles filters activated on click
	//////////////////////////////////////////////////////////////////
	document.getElementById( "graphisme" ).addEventListener( 'click', function() {  moveTiles("print");  });
	document.getElementById( "web" ).addEventListener( 'click', function() {        moveTiles("web");    });
	document.getElementById( "video" ).addEventListener( 'click', function() {      moveTiles("video");  });
	document.getElementById( "all" ).addEventListener( 'click', function() {        moveTiles();         });

	// displays a box shadow to the selected filter
	//////////////////////////////////////////////////////////////////
	$( "#filters button" ).click(function() {
		if ( $( this ).not( "selected" ) ) {
			$( "#filters button" ).removeClass( "selected" );
			$( this ).addClass( "selected" );
		}
	});

	var _this, posClicked, posDisplayed, detailsDisplayed, marginOffset;
	detailsHeight = document.querySelector( ".details" ).offsetHeight;
	var detailsWidth  = tileWidth * tilesPerLine;
	$( ".details" ).css( "width", detailsWidth);

	$( ".tile" ).click(function() {
		if ( $( "#all" ).hasClass("selected") ) {
			if ( $( this ).find( ".details" ).hasClass( "displayed" ) ) { // SI la vignette sur laquelle on clique est déjà développée
				hideDetails(this);
			} else if ( $( ".tile" ).find( ".displayed" ).length > 0 ) { // SI une autre vignette est déjà développée
				posClicked = $( this ).index();
				posDisplayed = $( ".displayed" ).parent().index();
				if ( tilesMatrix[posClicked].row != tilesMatrix[posDisplayed].row ) { // SI les vignettes sont sur des lignes différentes
					detailsDisplayed = $( ".tile" ).find( ".displayed" );
					$( detailsDisplayed ).removeClass( "displayed" );
					_this = this;
					setTimeout(function() {
						$( detailsDisplayed ).parent().css( "margin-bottom", 0 );
						tilesWrapperHeight();
						setTimeout(function() {
							detailsHeight = _this.querySelector( ".details" ).offsetHeight;
							$( _this ).css( "margin-bottom", detailsHeight );
							marginOffset = $( _this ).index();
							marginOffset =- tilesMatrix[marginOffset].col * tileWidth;
							$( _this ).find( ".details" ).css( "top", tileHeight - 10 ).css( "margin-left", marginOffset - 10 );
							tilesWrapperHeight(true);
							setTimeout(function() {
								$( _this ).find( ".details" ).addClass( "displayed" );
							}, 750);
						}, 750);
					}, 750);
				} else { // SI les vignettes sont sur la même ligne
					detailsDisplayed = $( ".tile" ).find( ".displayed" );
					displayedHeight = $( ".tile" ).find( ".displayed" ).height();
					$( detailsDisplayed ).removeClass( "displayed" );
					if ( $( this ).find( ".details" ).height() >= displayedHeight ) { // SI le détail de la vignette cliquée est plus grand que l'actuel
						detailsHeight = this.querySelector( ".details" ).offsetHeight;
						$( this ).css( "margin-bottom", detailsHeight );
						marginOffset = $( this ).index();
						marginOffset =- tilesMatrix[marginOffset].col * tileWidth;
						$( this ).find( ".details" ).css( "top", tileHeight - 10 ).css( "margin-left", marginOffset - 10 );
						tilesWrapperHeight(true);
						_this = this;
						setTimeout(function() {
							$( _this ).find( ".details" ).addClass( "displayed" );
							$( detailsDisplayed ).parent().css( "margin-bottom", 0 );
						}, 750);
					} else { // SI le détail de la vignette cliquée est plus petit que l'actuel
						detailsHeight = this.querySelector( ".details" ).offsetHeight;
						$( detailsDisplayed ).parent().css( "margin-bottom", 0 );
						$( this ).css( "margin-bottom", detailsHeight );
						marginOffset = $( this ).index();
						marginOffset =- tilesMatrix[marginOffset].col * tileWidth;
						$( this ).find( ".details" ).css( "top", tileHeight - 10 ).css( "margin-left", marginOffset - 10 );
						tilesWrapperHeight(true);
						_this = this;
						setTimeout(function() {
							$( _this ).find( ".details" ).addClass( "displayed" );
						}, 750);
					}
				}
			} else { // SI aucune vignette n'est développée
				detailsHeight = this.querySelector( ".details" ).offsetHeight;
				$( this ).css( "margin-bottom", detailsHeight );
				marginOffset = $( this ).index();
				marginOffset =- tilesMatrix[marginOffset].col * tileWidth;
				$( this ).find( ".details" ).css( "top", tileHeight - 10 ).css( "margin-left", marginOffset - 10 );
				tilesWrapperHeight(true);
				_this = this;
				setTimeout(function() {
					$( _this ).find( ".details" ).addClass( "displayed" );
				}, 750);
			}

		} else {
			
		} // end if click
		
	});

});