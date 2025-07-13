import {
  BaseTagPlugin,
  type IValidateTagString,
  type generateTagString,
} from "./baseTagPlugin";

export class ForLoopTagPlugin extends BaseTagPlugin {
  name = "FOR_LOOP_PLUGIN";

  regex = `^FOR iterator_${BaseTagPlugin.baseRE} IN ${BaseTagPlugin.variableRE}$`;
  closingTagRegex = `^END-FOR iterator_${BaseTagPlugin.baseRE}$`;

  generateTagString: generateTagString = ({
    varPath,
    refersToLoopIterator,
    data: _,
  }) => {
    const varDescriptor = this.getVariableDescriptor({
      varPath,
      refersToLoopIterator,
    });

    return [
      `FOR iterator_${varDescriptor} IN ${varDescriptor}`,
      `END-FOR iterator_${varDescriptor}`,
    ];
  };

  validateTagString = ({ command }: IValidateTagString) => {
    const regexes = [this.regex, this.closingTagRegex];

    for (const re in regexes) {
      const validationResult = BaseTagPlugin.baseValidateTagString(re, command);
      if (validationResult && !validationResult.message)
        return { isValid: true, variables: validationResult };
    }

    return { isValid: false };
  };
}
