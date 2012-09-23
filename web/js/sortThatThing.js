(function ($) {
    
    function SortThatThing (el, conf) {
        
        var self = this;

        //global values
        var tableData = [];
        var thIdPrefix = 'th-';
        var tdIdPrefix = 'td-';
        var trIdPrefix = 'tr-';
        var rowOrder = [];
        var sortOrder = [];
        var asc = true;
        var clickedColumn;

        if(conf.asc){
            asc=conf.asc;
        }

        //Internal functions

        var isArray = function (a) {
                return Object.prototype.toString.apply(a) === '[object Array]';
        };
        
        var getNoRows = function() {
            var noRows;
            $(el).find('tbody tr').each(function(i){ 
                noRows = i+1;
            })
            return noRows;
        };
        
        var getNoCols = function() {
            var noCols;
            $(el).find('thead th').each(function(i){ 
                noCols = i+1;
            })
            return noCols;
        };

        var addRow = function (row) {
            //är det en array?
            if(isArray(row)){
                //lika lång som tabellen?
                if(row.length === getNoCols()){
                    //Slabba på den bara
                    tableData.push(row);
                    orderBy(clickedColumn);
                    return 
                }
            }
            return null;
        };

        var delRow = function (rowNo) {
            tableData.splice(rowNo, 1);
            orderBy(clickedColumn);
        };
        
        var getTableData = function () {
            return tableData;
        };

        var redraw = function (sortColumn) {
            //fimpa tabellen som den ser ut i dag.
            $(el).find('tbody').html('');
            //loopa igenom sortOrder och skriv ut rätt rader.
            
            for(var i=0; i<sortOrder.length; i++){
                var rowEl = $(el).find('tbody').append('<tr id="'+trIdPrefix+i+'"></td>');
                
                var n = sortOrder[i];
                
                for(var x=0; x<getNoCols(); x++){
                    $('#'+trIdPrefix+i).append('<td class="'+tdIdPrefix + x+'">'+tableData[n][x]+'</td>');
                }                
            }
            
            
            if(sortColumn){
                //remove all the classes
                $('.sort').removeClass('asc');
                $('.sort').removeClass('desc');
                $('.sort').removeClass('sort');


                //change class on the clicked header.
                $('#'+thIdPrefix+sortColumn).addClass('sort');
                if(asc===true){
                    $('#'+thIdPrefix+sortColumn).addClass('asc');                
                }else{
                    $('#'+thIdPrefix+sortColumn).addClass('desc');
                }

                //add class on the clicked column
                $('.'+tdIdPrefix+sortColumn).addClass('sort');                
            }

            
        };

        var orderBy = function (sortColumn) {
            
            var column = [];
            
            for(var i=0; i<tableData.length; i++){
                var tmpRow = tableData[i];
                var tmpData = tmpRow[sortColumn];
                
                column.push(tmpData + "_" + i);
            }
            
            var sortedColumn = [];
            for(var i=0; i<column.length; i++){
                sortedColumn[i] = column[i];
            }
            
            sortedColumn.sort();
            if(asc!==true){
                sortedColumn.reverse();
            }
            
            //clear the sortorder
            sortOrder.splice(0, sortOrder.length);
            
            for(var i=0; i<column.length; i++){
                
                var order = column.indexOf(sortedColumn[i]);
                
                sortOrder.push(order);

            }
            
            redraw(sortColumn);
            
        };

        var init = function () {
            //make the headings distinguisable.
            $(el).find('thead th').each(function(i){
                this.id = thIdPrefix + i;
            });
            
            //make the table easy to find.
            el.id = ''
            
            //get the rows and put them in the row array.
            $(el).find('tbody tr').each(function(){
                var tmpRow = [];
                
                $(this).find('td').each(function () {
                    tmpRow.push($(this).html());
                });
                
                tableData.push(tmpRow);
                
            });
            
            //sort it by a column.
            var defaultSort = 0;
            if(conf.defaultSort){
                defaultSort = conf.defaultSort;
                clickedColumn=''+defaultSort;
            }
            
            orderBy(defaultSort);
            
            //make stuff clickable.
            $(el).find('thead th').click(function(){
                
                var sortColumn = this.id.replace(thIdPrefix, '');
                
                if(clickedColumn===sortColumn){
                    if(asc==true){
                        asc=false;
                    }else{
                        asc=true;
                    }
                    
                }else{
                    asc=true;
                }
                
                clickedColumn = sortColumn;
                
                orderBy(sortColumn);
            });
        };

        // variables;
        var noRows = getNoRows();
        var noRows = getNoCols();

        init(el);

        // API Methods
        $.extend(self, {
            noRows : function(){
                return getNoRows();
            },
            addRow : function (row) {
                return addRow(row);
            },
            delRow : function (rowNo) {
                delRow(rowNo);
            },
            getTableData : function () {
                return getTableData();
            }
        });



    }

    // jQuery plugin initialization
    $.fn.sortThatThing = function (conf) {


        // already constructed --> return API
        var el = this.data("sortThatThing");
        if (el) {
            return el;
        }

        if ($.isFunction(conf)) {
            conf = {
                onBeforeLoad: conf
            };
        }

        this.each(function () {
            el = new SortThatThing($(this), conf);
            $(this).data("sortThatThing", el);
        });

        return conf.api ? el : this;
    };
}(jQuery));