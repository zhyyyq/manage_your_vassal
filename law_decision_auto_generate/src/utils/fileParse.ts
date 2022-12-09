export const a = '';

class V3ConfigObj {
    private name: string;
    private content: V3ConfigObj[] = [];
    constructor(name: string){
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setName(name: string) {
        this.name = name;
    }
    getContent(){
        return this.content || [];
    }
    setContent(content: V3ConfigObj[]){
        this.content = content;
    }
    toString(){
        return { name: this.name, content: this.content?.map(toString)};
    }
}
export const parse_file = ( fileContent: string): V3ConfigObj[] => {
    // paradox's file is simple base on indent which means we can parse it using stack

    // filter code remark
    const filtered = fileContent.split('\n').filter( item => !item.includes("#") && item);
    const lines = filtered.join(' ').split(/\s/).filter( item => item);
    const stack: ('='|"{"|"}"| V3ConfigObj)[] = [];
    lines.forEach( word => {
        if( /\w/.test(word)){
            const obj = new V3ConfigObj(word);
            if( stack[stack.length-1] === '='){
                stack.pop();
                const key = stack[stack.length-1] as V3ConfigObj;
                key.setContent([obj]);
            }else{
                stack.push(obj);
            }   
        }else if( /=/.test(word)){
            stack.push('=');
        }else if( /\{/.test(word)){
            stack.push('{');
        }else if( /\}/.test(word)){
            let t = stack.pop()
            let content: V3ConfigObj[] = [];
            while( t !== '{'){
                content.push(t as unknown as V3ConfigObj);
                t = stack.pop();
            }
            stack.pop();
            const key = stack[stack.length-1] as V3ConfigObj;
            key.setContent(content);
        }else{
            // exception
        }
    });
    return stack as any;
}