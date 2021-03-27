import { NamedNode } from "./named-node";

export class Triple {
    subject: NamedNode | undefined;
    predicate: NamedNode | undefined;
    object: NamedNode | undefined;
}
