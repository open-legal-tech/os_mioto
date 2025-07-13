import {
  BaseTagPlugin,
  type IValidateTagString,
  type generateTagString,
} from "./baseTagPlugin";

export class InsertTagPlugin extends BaseTagPlugin {
  name = "INSERT_PLUGIN";

  regex = `^INS ${BaseTagPlugin.variableRE()}$`;

  generateTagString: generateTagString = ({
    varPath,
    refersToLoopIterator,
    data: _,
  }) => {
    const varDescriptor = this.getVariableDescriptor({
      varPath,
      refersToLoopIterator,
    });

    return [`INS f(${varDescriptor})`];
  };

  validateTagString = ({ command }: IValidateTagString) => {
    const validationResult = BaseTagPlugin.baseValidateTagString(
      this.regex,
      command,
    );
    if (validationResult && !validationResult.message)
      return { isValid: true, variables: validationResult };

    return { isValid: false };
  };
}
