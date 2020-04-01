var exec = require('child_process');
const _ = require('lodash');

function ghc(comando) {
    var re = new RegExp('"', 'g');
    var _comando = comando.replace(re, "\\\"");
    console.log(_comando);
    exec.exec(`docker run -i -rm haskell:8 bash -c "ghci <<< $0" "${_comando}" `, { timeout: 5000 }, function(error, stdout, stderr) {
        var rta = _.split(stdout, '\n', 3)[1];
        //console.log(rta);
        if (error !== null) {
            console.log(error);
            console.log('Stack Overflow');
        } else if (!rta.includes('Leaving GHCi')) {
            //console.log('Comando ghc ejecutado.\n' + `\`\`\` haskell ${rta}\`\`\``);
            console.log(`\`\`\` haskell ${rta}\`\`\``);
        } else {
            console.log('Comando de ghc incorrecto.');
        };
    });
}
ghc(':t head');