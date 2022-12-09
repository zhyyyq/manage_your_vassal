import fs from 'fs';
import path from 'path';
import { parse_file } from './utils';
const game_base_dir = 'D:\\SteamLibrary\\steamapps\\common\\Victoria 3\\game\\common\\laws';
const dir = fs.readdirSync(game_base_dir);



// handle file 
const handleLawFile = (fileName: string, content: string) => {
    const parsedContent = parse_file(content);
    const options = parsedContent.map( (item, index) => {
        return `
            option = {
                name = purge_your_vassal_policy_${fileName}_events.1.choose.${index}
                scope:target_country = {
                    activate_law = law_type:${item.getName()}
                }
            }
        `;
    }).join('\n');
    // generate the mod file 
    const template = fs.readFileSync( path.join(__dirname,'../template/policy_temp.txt')).toString();
    const res = template.replace(/###policy_name###/g, fileName).replace(/###options###/, options);
    fs.writeFileSync(`${path.join(__dirname,`../dist/purge_your_vassal_policy_${fileName}`)}`, res );
}

const task = dir.map( async file => {
    const fileContent = fs.readFileSync(game_base_dir + '/' + file );
    handleLawFile(file, fileContent.toString());
});

const main = async () => {
    await Promise.all(task);
}

main();
