export class Triple {
    subject: string;
    predicate: string;
    object: string;

    constructor(s: string, p: string, o: string){
        this.subject = s;
        this.predicate = p;
        this.object = o;
    }
}
