// A simple module to highlight word using regular expression


var Highlighter = {
    // this regular expression find all words ignore special characters. Each word can have "-","." or "'" in between.    
    singleWordRegEx: new RegExp(/[^\W](\w|[-.\\\/]{1,2}|[']{1,1}(?=\w))*/gi),

    // store the regex generated from the search input    
    searchWordsRegExp: "",

    // store the previous id and the previous html content so that we can restore the html before doing another highlight
    nodeSelector: "",    
    nodeSourceContent: "",

    // need to pass id of the node container and the words to highlight
    show: function (targetNodeSelector, wordToSearch) {        
        if (wordToSearch && wordToSearch.trim() != "") {
            searchWords = wordToSearch.match(Highlighter.singleWordRegEx);
            Highlighter.searchWordsRegExp = new RegExp("(" + searchWords.join('|') + ")", "gi")
        }
        else {
            console.log("highlighter: your search input is empty");
            return;
        }

        // assume the selector is an id
        var targetNode = document.getElementById(targetNodeSelector);

        // now try class
        if (targetNode == undefined) {
            targetNode = document.getElementsByClassName(targetNodeSelector);
        }

        // if it is not found then, something must not be set up correctly
        if (targetNode != undefined) {
            // if the target node is the same as the previous node -> restore the content before doing another request
            if (targetNodeSelector == Highlighter.nodeSelector) {
                targetNode.innerHTML = Highlighter.nodeSourceContent;
            }
            else {
                Highlighter.nodeSelector = targetNodeSelector;
                Highlighter.nodeSourceContent = targetNode.innerHTML;
            }

            Highlighter.traverseDOMTree(targetNode);
        }
        else {
            console.log("highlighter: cannot find the selector");
            return;
        }
    },
    traverseDOMTree: function(node)
    {
        // the current node is a text node then look for wanted words
        if (node && node.nodeName && node.nodeName == "#text") {
            var requireTransform = false;
            var nodeNewHTML = node.textContent;
            if (nodeNewHTML && nodeNewHTML.trim() != "") {

                if (Highlighter.searchWordsRegExp.test(nodeNewHTML)) {
                    requireTransform = true;
                    nodeNewHTML = nodeNewHTML.replace(Highlighter.searchWordsRegExp, function($1){
                        return "<mark class='word-highlight'>" + $1 + "</mark>";
                    });
                }
               
                // replace the text node with a new span node
                if (requireTransform) {
                    var newNode = document.createElement("span");
                    newNode.innerHTML = nodeNewHTML;
                    var parentNode = node.parentNode;
                    parentNode.replaceChild(newNode, node);
                }
            }
        }
        else {
            // recursive tranverse into the children
            // save the current children so that the hierachy does not get lost since because we use replaceChild()
            var nodeChildren = node.childNodes;
            if (nodeChildren && nodeChildren.length) {
                for (var i = 0; i < nodeChildren.length; i++) {
                    var singleChildNode = node.childNodes[i];
                    Highlighter.traverseDOMTree(singleChildNode);
                }
            }
        }
    }
};