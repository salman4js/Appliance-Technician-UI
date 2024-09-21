import BaseCommands from "./base.commands";
import defaultCommandOptions from './extended.commands.path.json';
import inlineMenuActionCommandOptions from './extended.commands.inline.menu.path.json';

const setupCommandsInstances = (signatureOptions, options) => {
    options = options || {};
    let commandOptions = defaultCommandOptions;
    if(options.inlineMenuActions){
        commandOptions = inlineMenuActionCommandOptions;
    }
    const baseCommands = new BaseCommands();
    baseCommands.setupInstancesFromConfig(commandOptions, signatureOptions);
    return baseCommands;
};

export default setupCommandsInstances;
