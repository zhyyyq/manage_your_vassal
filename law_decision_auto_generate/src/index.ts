import fs from 'fs';
import path from 'path';
import { policy_group } from './common';
import { parse_file } from './utils';
const game_base_dir = 'D:\\SteamLibrary\\steamapps\\common\\Victoria 3\\game\\common\\laws';




// handle file 
const handleLawFile = (fileName: string, content: string) => {
    const policy_name = policy_group.flatMap( item => item.subs).find( sub => fileName.includes(sub))|| fileName;
    const parsedContent = parse_file(content);
    const options = parsedContent.map( (item, index) => (
    `
    option = {
        name = purge_your_vassal_policy_menu3.${policy_name}.events.1.choose.${index+1}
        scope:target_country = {
            activate_law = law_type:${item.getName()}
        }
    }
    `)
    ).join('\n');
    // generate the mod file 
    const template = fs.readFileSync( path.join(__dirname,'../template/menu3_temp.txt')).toString();
    const res = template.replace(/###policy_name###/g, policy_name).replace(/###options###/g, options);
    return res;
}
const generateMenu2 = async () => {
    const template = fs.readFileSync( path.join(__dirname,'../template/menu2_temp.txt')).toString();
    const menus = policy_group.map( (policy, index) => {
        const options = policy.subs.map( (item, index) => (
    `
    
    option = {
        name = purge_your_vassal_policy_menu2_events.choose.${index+1}
        trigger_event = { id = purge_your_vassal_policy_menu3.${item} popup = yes }
    }
    `
    )).join('\n');
        const res = template.replace(/###option_name###/g, ""+(index+1)).replace(/###options###/g, options);
        return res;
    }).join('\n');
    const res = "namespace = purge_your_vassal_policy_menu2\n" + menus;
    fs.writeFileSync(`${path.join(__dirname,`../dist/purge_your_vassal_policy_menu2.txt`)}`, res );
}
const generateMenu3 = async (fileNames: string[]) => {
    const tasks = fileNames.map( async file => {
        const fileContent = fs.readFileSync(game_base_dir + '/' + file );
        const res = handleLawFile(file, fileContent.toString());
        return res;
    });
    const files = "namespace = purge_your_vassal_policy_menu3\n" + await (await Promise.all(tasks)).join("\n");
    fs.writeFileSync(`${path.join(__dirname,`../dist/purge_your_vassal_policy_menu3.txt`)}`, files );
}

const main = async () => {
    const dir = fs.readdirSync(game_base_dir);
    await Promise.all([generateMenu3(dir),generateMenu2()]);
}

main();
