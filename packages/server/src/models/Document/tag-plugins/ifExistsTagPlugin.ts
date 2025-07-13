import {
  BaseTagPlugin,
  type IValidateTagString,
  type generateTagString,
} from "./baseTagPlugin";

export class IfExistsTagPlugin extends BaseTagPlugin {
  name = "IF_EXISTS_PLUGIN";

  regex = `^IF ${BaseTagPlugin.variableRE()}$`;

  generateTagString: generateTagString = ({
    varPath,
    refersToLoopIterator,
    data: _,
  }) => {
    const varDescriptor = this.getVariableDescriptor({
      varPath,
      refersToLoopIterator,
    });

    return [`IF f(${varDescriptor})`];
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
