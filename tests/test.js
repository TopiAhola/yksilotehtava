'use strict';

import {updateUser, getUser, login} from '../api/api.js';


const userDefault = {
    "username": "asdfghj",
    "email": "asdfghj@example.com",
    "_id": "691dfde03116ae25faca7f38",
    "role": "user",
    "activated": true,
    "favouriteRestaurant": "65f37b9fcf627e00930bbd81"
}

const updateBody = {
    username: "asdfghj",
    email: "asdfghj@example.com",
    _id: "691dfde03116ae25faca7f38",
    role: "user",
    activated: true,
    favouriteRestaurant: "65f37b9fcf627e00930bbd81"
}


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFzZGZnaGoiLCJlbWFpbCI6ImFzZGZnaGpAZXhhbXBsZS5jb20iLCJfaWQiOiI2OTFkZmRlMDMxMTZhZTI1ZmFjYTdmMzgiLCJyb2xlIjoidXNlciIsImFjdGl2YXRlZCI6dHJ1ZSwiaWF0IjoxNzYzNTczMzE2fQ.wFmekqWyGl5EDXqZHfzNPVGpaoST86llS3eLSQ5VVrE';

async function testUpdate() {
    const userBefore = await getUser(token);
    console.log(userBefore);

    const updatedUser = await updateUser(updateBody, token);
    console.log(updatedUser);
    console.log(updatedUser.user);
}

//aja testi
testUpdate();

