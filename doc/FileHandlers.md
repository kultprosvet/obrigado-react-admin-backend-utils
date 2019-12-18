# File Handlers
There are currently 2 file handlers available:
+ LocalFileHandler for storing files locally;
+ AwsS3FileHandler for storing files at AWS S3.

## File Handler for local files
When creating a resolver for your entity you can pass an object (updateHelperOptions) with additional options as a 4th argument. Create a new instance of LocalFileHandler class and pass it to the fileHandler property of those options. 

LocalFileHandler's constructor requires a config object with an absolute path to the folder where your files will be stored. If you don't provide your own path, files folder will be created automatically in your project's directory.
```javascript
import {
    LocalFileHandler,
    createBaseCrudResolver,
} from 'obrigado-react-admin-backend-utils'
...

const EntityBaseResolver = createBaseCrudResolver(
    EntityGraphQL,
    EntityGraphQLInput,
    Entity,
    {
      fileHandler: new LocalFileHandler({
          folder: '../myProject/files'
      })
    }
)
@Resolver()
export class _EntityResolver extends EntityBaseResolver {}  
``` 

##File Handler for AWS S3
If you store files at AWS S3, you can use AwsS3FileHandler class to create the File Handler.

AwsS3FileHandler's constructor requires a config object with your AWS account's key, secret, bucket name, region code and folder. If the specified folder doesn't exist in the specified bucket, it will be created automatically.
```javascript
import {
    AwsS3FileHandler,
    createBaseCrudResolver,
} from 'obrigado-react-admin-backend-utils'
...

const EntityBaseResolver = createBaseCrudResolver(
    EntityGraphQL,
    EntityGraphQLInput,
    Entity,
    {
      fileHandler: new AwsS3FileHandler({
          awsKey: 'your AWS key',
          awsSecret: 'your AWS secret',
          region: 'your AWS region code',
          folder: 'folder name in your AWS bucket',
          bucket: 'your AWS bucket name'
      })
    }
)
@Resolver()
export class _EntityResolver extends EntityBaseResolver {} 
``` 