import { Failure } from "@mioto/errors";
import { createReport, listCommands } from "docx-templates";
import type * as generateHandler from "./generate";
import { type TTemplateError, TemplateFailure } from "./shared";
import {
  ForLoopTagPlugin,
  IfCompareTagPlugin,
  IfExistsTagPlugin,
  InsertTagPlugin,
} from "./tag-plugins";

/*
--- NOTES ---
___________
KNOWN ISSUES
- The tag validation of the ifCompare plugin fails sometimes, I suspect this is an issue in the BaseTagPlugin.baseValidateTagString() function, the
   whole baseValidate function should be revised and build properly to reliably validate and extract the used variables.

- The for loop functionality is not properly implemented yet. The big issue is the naming of the for loop iterator and the validation of tags using this iterator.
________
TO-DO

0. Build the fetchVariable functions
We need two get variable functions which fetch the value of any variable. The safeFetch should return the variable value Base64 encoded, using the BaseTagPlugin
encoding method.

        const fetchVariable = (args) => {do stuff};

        const safeFetchVariable = (args) => {
          const varData = getVariable = (args)
          return BaseTagPlugin.toBase64(varData)
        };

Then, we need to pass the functions named as f or sf in the additionalJsContext when configuring the doc gen.

      additionalJsContext: {
        // f: fetchVariable(),
        // sf: safeFetchVariable(),
      },


1. Variable Extraction
Extract variables during validation: while the regexes already contain named matchgroups, we need to make sure to properly pass the extracted variables used in the tag
back to the main validate() function in this file. Thid requires properly handling the match groups in the BaseTagPlugin.baseValidateTagString(), returning the variables to
the validateTagString() function of the tagPlugin and then storing all variables used in the document.

2. Test Generation
We need to do a test generation as some issues like unclosed IF clauses are only detected when trying to generate the doc. Therfore, we probably should extract the used
variables, generate fake data for the the used variables according to their type and then do a demo generation. This way we can ensure the document can be sucessfully generated.

3. Null getter/default value
We need to define what happens when a variable used in a document template is not in the dataset provided during the generation process. Should the generation fail, should we
have a null getter, which can get a default value if one was set by the user for this variable or just use a global default value?

// From here on the features are nice to have

4. Sandbox
We should use vm2 oe something similar as an additional layer of protection as we are executing user-provided JS in the templates. The default runtime environment vm is
explicitly not a sandbox. For more information see here: https://github.com/guigrpa/docx-templates#performance--security. Instead of vm2, which is used in the sample mentioned
by the readme and seems a bit hard to handle, we could use something like https://github.com/NeilFraser/JS-Interpreter.

5. Improve checks when generating template tags
Would be good to check if the action of the template tag is compatible with the type of the variable it is using. Before using a variable in a for loop, whe should e.g. check
if the variable iterable is.

*/

export const TagPlugins = [
  new IfCompareTagPlugin(),
  new InsertTagPlugin(),
  new IfExistsTagPlugin(),
  new ForLoopTagPlugin(),
];

export const generate = async (
  variables: generateHandler.TInput["variables"],
  docTemplate: ArrayBuffer,
) => {
  try {
    const buf = await createReport({
      template: Buffer.from(docTemplate),
      data: variables,
      cmdDelimiter: ["{", "}"],
      fixSmartQuotes: true,
      failFast: false,
      rejectNullish: true,
      // TODO: built these functions
      additionalJsContext: {
        // resolve
        // f: fetchVariable(),
        // sf: safeFetchVariable(),
      },
    });
    return Buffer.from(buf);
  } catch (error: any) {
    //TODO: proper error handling
    console.log(error);
    return TemplateFailure(error);
  }
};

export const validate = async (docTemplate: ArrayBuffer) => {
  try {
    //Extract the commands from the template.
    const commands = await listCommands(docTemplate, ["{", "}"]);

    const templateErrors: TTemplateError[] = [];
    const usedVariables = new Set();

    // TODO Extract all used variables, generate fake data and then run the generation to test the template. This is necessary to test if a template is actually working and doesn't have e.g. unclosed if-tags.

    // We check all commands if they only perform allowed actions and don't execute malicious code.
    commands.forEach((command) => {
      // TODO: does this make sense? Maybe we just use an array

      const isWhitelistedCode = TagPlugins.some((plugin) => {
        const validationResult = plugin.validateTagString({ command });
        if (validationResult.isValid) {
          // FIXME: this is just stub code, we need to think how we want to store the extracted variables
          usedVariables.add(validationResult.variables);
          return true;
        }
        return false;
      });

      if (!isWhitelistedCode) {
        templateErrors.push({
          name: "Invalid template code",
          message: `The code ${command.code} is currently not allowed.`,
          tag: command.raw,
        });
      }
      return;
    });

    if (templateErrors.length !== 0) {
      return TemplateFailure(templateErrors);
    }

    // The next lines are stub for demonstration purposes, this is how the demo generation process could look like.
    const generateDemoData = (_usedVariables: Set<any>) => {
      return {};
    };

    const demoData = generateDemoData(usedVariables);

    const testGenerationResult = generate(demoData, docTemplate);

    if (testGenerationResult instanceof Failure) return testGenerationResult;

    return { isValid: true, variables: usedVariables };
  } catch (error: any) {
    return TemplateFailure(error);
  }
};
