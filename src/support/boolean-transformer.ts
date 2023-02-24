import { TransformFnParams } from "class-transformer";

const booleanTransformer: (params: TransformFnParams) => boolean = ({value}) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value === 'true' || value === '1' || value === 1;
}

export default booleanTransformer;