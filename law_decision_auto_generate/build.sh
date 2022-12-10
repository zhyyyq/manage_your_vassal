#! /bin/bash
rm -rf dist
mkdir -p dist/events
mkdir -p dist/localization/english
mkdir -p dist/localization/simp_chinese
npm run build
echo "update mode files"
ls dist/events | grep txt | awk '{ system("rm -rf ../manage_your_vassal/events/"$1" ") }'
ls dist/localization/english | grep yml | awk '{ system("rm -rf ../manage_your_vassal/localization/english/"$1" ") }'
ls dist/localization/simp_chinese | grep yml | awk '{ system("rm -rf ../manage_your_vassal/localization/simp_chinese/"$1" ") }'
mv -u dist/events/* ../manage_your_vassal/events
mv -u dist/localization/english/* ../manage_your_vassal/localization/english
mv -u dist/localization/simp_chinese/* ../manage_your_vassal/localization/simp_chinese