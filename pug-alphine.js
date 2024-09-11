const fs = require('fs');


var content = '';
module.exports = {
	preCodeGen: function(ast, options) {
		var content = JSON.stringify(ast)
        fs.writeFileSync('dist/test.txt', content)
        processNode(ast)
		return ast
	}
}


function processNode(node)
{
   
    if (node.type == 'Conditional') { 
        Object.assign(node, {
            type: 'Tag',
            name: 'template',
            selfClosing: false,
            block: node.consequent,
            attrs: [{
                name: 'x-if',
                val: `"${node.test}"`,
                mustEscape: false,
            }],
            attributeBlocks: [], 
            isInline: false
        });
        delete node.test;
        delete node.consequent;
        delete node.alternate;
    } else if (node.type == 'Each') {
        
        var f = "";
        if (node.key) {
            f = `"(${node.val}, ${node.key}) in ${node.obj}"`
        } else {
            f = `"${node.val} in ${node.obj}"`
        }
        
        Object.assign(node, {
            type: 'Tag',
            name: 'template',
            selfClosing: false,
            attrs: [{
                name: 'x-for',
                val: f,
                mustEscape: false,
            }],
            attributeBlocks: [], 
            isInline: false
        });
        delete node.val;
        delete node.key;
        delete node.obj;
    }



    if (Array.isArray(node.nodes)) {
        for (var n of node.nodes) {
            processNode(n);
        }
    } else if (node.block) {
        if (Array.isArray(node.block.nodes)) {
            var isText = true;
            var hasCode = false;
            var hasHtml = false;
            for (var n of node.block.nodes) {
                if (n.type == 'Code' && n.buffer == true) {
                    hasCode = true;
                }
                if (['Text', 'Code'].indexOf(n.type) == -1) {
                    isText = false; 
                    break;
                }
            }

            if (isText && hasCode) {
                var xtext = [];
                for (var n of node.block.nodes) {
                    if (n.type == 'Text') {
                        xtext.push(`'${n.val}'`) 
                    } else {
                        xtext.push(n.val)
                    }
                }

                node.attrs.push({
                    name: 'x-text',
                    val: `"${xtext.join(' + ')}"`,
                    mustEscape: false,
                })
                node.block.nodes =[]

            } else {
                processNode(node.block)
            }
        } else {
            processNode(node.block)
        }
    }
}
