# Firebase URL Shortner
> A serverless url shortener made with Firebase

### [Live Demo](https://ajzbc.com/firebase-url-shortener)

## Setup

#### Edit index.js config variables
Replace with Firebase project ID (Can be found on project dashboard)
```javascript
let projectID = "fire-url"
```
Replace with desired Firestore collection for shortned urls to be saved
```javascript
let collection = "list"
```
(Optional) Edit if url where urls are shortened will not be the same as the shortened url
```javascript
var local = window.location.href
```
(Optional) Edit length of random hash
```javascript
var hashLength = 5
```

#### Firestore Rules
Basic rules to allow users to shorten links.   
Replace `COLLECTION` with the collection name used in `index.js`
```
service cloud.firestore {
  match /databases/{database}/documents {
    match /COLLECTION/{url} {
      allow read, create;
    }
  }
}
```
