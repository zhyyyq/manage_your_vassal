import fs from "fs";
import path from "path";
import { policy_group } from "./common";
import { parse_file } from "./utils";
const game_base_dir =
  "E:\\SteamLibrary\\steamapps\\common\\Victoria 3\\game\\common\\laws";

// handle file
const handleLawFile = (fileName: string, content: string) => {
  const policy_name =
    policy_group
      .flatMap((item) => item.subs)
      .find((sub) => fileName.includes(sub.fileName))?.name || fileName;
  const parsedContent = parse_file(content);
  const options = parsedContent
    .map(
      (item, index) =>
        `
    option = {
        name = purge_your_vassal_policy_menu3_${policy_name}_events.1.choose.${
          index + 1
        }
        remove_modifier = purge_your_vassal
        scope:target_country = {
            activate_law = law_type:${item[0]}
        }
    }
    `
    )
    .join("\n");
  // generate the mod file
  const template = fs
    .readFileSync(path.join(__dirname, "../template/menu3_temp.txt"))
    .toString();
  const res = template
    .replace(/###policy_name###/g, policy_name)
    .replace(/###options###/g, options);
  fs.writeFileSync(
    `${path.join(
      __dirname,
      `../dist/events/purge_your_vassal_policy_menu3_${policy_name}.txt`
    )}`,
    res
  );
  // localization
  const fileHead_eng = "l_english:\n";
  const fileHead_simp_chinese = "l_simp_chinese:\n";
  const event = ` purge_your_vassal_policy_menu3_${policy_name}.1:0 "$lawgroup_${policy_name}$ policy modify"\n`;
  const eventTitle = ` purge_your_vassal_policy_menu3_${policy_name}_events.1.t:0 "$lawgroup_${policy_name}$ policy modify"\n`;
  const eventDetail = ` purge_your_vassal_policy_menu3_${policy_name}_events.1.d:0 "modify vassal's policy"\n`;
  const event_cn = ` purge_your_vassal_policy_menu3_${policy_name}.1:0 "$lawgroup_${policy_name}$ 政策修改"\n`;
  const eventTitle_cn = ` purge_your_vassal_policy_menu3_${policy_name}_events.1.t:0 "$lawgroup_${policy_name}$ 政策修改"\n`;
  const eventDetail_cn = ` purge_your_vassal_policy_menu3_${policy_name}_events.1.d:0 "附庸政策修改"\n`;
  const optionLocals = parsedContent
    .map(
      (item, index) =>
        ` purge_your_vassal_policy_menu3_${policy_name}_events.1.choose.${
          index + 1
        }:0 "$${item[0]}$"`
    )
    .join("\n");
  fs.writeFileSync(
    `${path.join(
      __dirname,
      `../dist/localization/english/purge_your_vassal_policy_menu3_${policy_name}_l_english.yml`
    )}`,
    `\ufeff${fileHead_eng}${event}${eventTitle}${eventDetail}${optionLocals}`
  );
  fs.writeFileSync(
    `${path.join(
      __dirname,
      `../dist/localization/simp_chinese/purge_your_vassal_policy_menu3_${policy_name}_l_simp_chinese.yml`
    )}`,
    `\ufeff${fileHead_simp_chinese}${event_cn}${eventTitle_cn}${eventDetail_cn}${optionLocals}`
  );
};
const generateMenu2 = async () => {
  const template = fs
    .readFileSync(path.join(__dirname, "../template/menu2_temp.txt"))
    .toString();
  const menus = policy_group
    .map((policy, gIndex) => {
      const options = policy.subs
        .map(
          (item, index) =>
            `
    
    option = {
        name = purge_your_vassal_policy_menu2_events.${gIndex + 1}.choose.${
              index + 1
            }
        trigger_event = { id = purge_your_vassal_policy_menu3_${
          item.name
        }.1 popup = yes }
    }
    `
        )
        .join("\n");
      const res = template
        .replace(/###option_name###/g, "" + (gIndex + 1))
        .replace(/###options###/g, options);
      return res;
    })
    .join("\n");
  const res = "namespace = purge_your_vassal_policy_menu2\n" + menus;
  fs.writeFileSync(
    `${path.join(
      __dirname,
      `../dist/events/purge_your_vassal_policy_menu2.txt`
    )}`,
    "\ufeff" + res
  );
  // localization
  const fileHead_eng = "l_english:\n";
  const fileHead_simp_chinese = "l_simp_chinese:\n";
  const optionLocals = policy_group
    .map((policy, gIndex) => {
      const event = ` purge_your_vassal_policy_menu2.${
        gIndex + 1
      }:0 "policy modify"\n`;
      const event_cn = ` purge_your_vassal_policy_menu2.${
        gIndex + 1
      }:0 "政策修改"\n`;
      const eventTitle = ` purge_your_vassal_policy_menu2_events.${
        gIndex + 1
      }.t:0 "policy modify"\n`;
      const eventTitle_cn = ` purge_your_vassal_policy_menu2_events.${
        gIndex + 1
      }.t:0 "政策修改"\n`;
      const eventDetail = ` purge_your_vassal_policy_menu2_events.${
        gIndex + 1
      }.d:0 "modify vassal's policy"\n`;
      const eventDetail_cn = ` purge_your_vassal_policy_menu2_events.${
        gIndex + 1
      }.d:0 "附庸政策修改"\n`;
      const optionsLocals = policy.subs
        .map(
          (item, oIndex) =>
            ` purge_your_vassal_policy_menu2_events.${gIndex + 1}.choose.${
              oIndex + 1
            }:0 "$lawgroup_${item.name}$"`
        )
        .join("\n");
      return {
        eng: `${event}${eventTitle}${eventDetail}${optionsLocals}\n`,
        cn: `${event_cn}${eventTitle_cn}${eventDetail_cn}${optionsLocals}\n`,
      };
    })
    .reduce(
      (prev, cur) => {
        prev.eng += cur.eng;
        prev.cn += cur.cn;
        return prev;
      },
      { eng: "", cn: "" }
    );
  fs.writeFileSync(
    `${path.join(
      __dirname,
      `../dist/localization/english/purge_your_vassal_policy_menu2_l_english.yml`
    )}`,
    "\ufeff" + fileHead_eng + optionLocals.eng
  );
  fs.writeFileSync(
    `${path.join(
      __dirname,
      `../dist/localization/simp_chinese/purge_your_vassal_policy_menu2_l_simp_chinese.yml`
    )}`,
    "\ufeff" + fileHead_simp_chinese + optionLocals.cn
  );
};
const generateMenu3 = async (fileNames: string[]) => {
  fileNames.forEach((file) => {
    console.log(file);
    const fileContent = fs.readFileSync(game_base_dir + "/" + file);
    handleLawFile(file, fileContent.toString());
  });
};

const main = async () => {
  const dir = fs.readdirSync(game_base_dir);
  await generateMenu3(dir);
  await generateMenu2();
};

main();
