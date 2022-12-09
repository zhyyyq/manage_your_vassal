import fs from 'fs';
import path from 'path';
import { parse_file } from './utils';
const game_base_dir = 'D:\\SteamLibrary\\steamapps\\common\\Victoria 3\\game\\common\\laws';




// handle file 
const handleLawFile = (fileName: string, content: string) => {
    const parsedContent = parse_file(content);
    const options = parsedContent.map( (item, index) => (
    `
    option = {
        name = purge_your_vassal_policy_${fileName}_events.1.choose.${index}
        scope:target_country = {
            activate_law = law_type:${item.getName()}
        }
    }
    `)
    ).join('\n');
    // generate the mod file 
    const template = fs.readFileSync( path.join(__dirname,'../template/policy_temp.txt')).toString();
    const res = template.replace(/###policy_name###/g, fileName).replace(/###options###/, options);
    return res;
}
const generateMenu = async (fileNames: string[]) => {
    const template = fs.readFileSync( path.join(__dirname,'../template/menu_temp.txt')).toString();
    const options = fileNames.map( (item, index) => (
    `
    option = {
        name = purge_your_vassal_policy_1_events.1.choose.${index}
        trigger_event = { id = purge_your_vassal_policy_${item}.1 popup = yes }
    }
    `
    )).join('\n');
    const res = template.replace('###options###', options);
    fs.writeFileSync(`${path.join(__dirname,`../dist/purge_your_vassal_policy_menu.txt`)}`, res );
}
const generateDetail = async (fileNames: string[]) => {
    const tasks = fileNames.map( async file => {
        const fileContent = fs.readFileSync(game_base_dir + '/' + file );
        const res = handleLawFile(file, fileContent.toString());
        return res;
    });
    const files = "namespace = purge_your_vassal_policy_options\n" + await (await Promise.all(tasks)).join("\n");
    fs.writeFileSync(`${path.join(__dirname,`../dist/purge_your_vassal_policy_options.txt`)}`, files );
}

const main = async () => {
    const dir = fs.readdirSync(game_base_dir);
    await Promise.all([generateDetail(dir),generateMenu(dir)]);
}

main();
