# SIPM Master Lambda

The function is invoked bby apigatway event and gets the data from dynamoDB database

# Dependencies

```
1) Node js runtime version should be V14.x. [14.x] : NODE JS major version should be 14 and any minor should be fine(Ex.14.0,..).
2) Check the Version of NODE JS by executing the command: [node -v]
4) Inside the project repo
	Run: npm install
5) Install serverless
	npm install -g serverless
```

# Function deployment:

Run below command

serverless deploy --region {region} --stage {stage}
