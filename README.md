# Project Name Here

I want to give my users the ability to edit their own
webpage but not the ability to make everything bright
red and comic sans. Plus, setting up a WSIWYG is a pain
in the ass when you have to support images and links.

### Enter this project.

I give my clients a folder of Google Documents and my
clients can copyedit all of their content it all gets
updated instantly and I don't have to worry about them
fucking with my styles! :+1:

## Setup

    git clone http://github.com/xori/plasma-anomaly
    cd plasma-anomaly
    npm install
    # get some google docs clientid & secrets
    # put them in 'secret.json' see 'secret.example.json'
    npm start

then in a browser visit to confirm working.

    localhost:8000/test

then in some cool design you've been working on

    <script src="//code.jquery.com/jquery-2.1.1.min.js" />
    <script src="localhost:8000/include.js" />
    <section data-fragment="googleid"></section>

note that there are a few options available to you.

    <!-- don't strip styles from the document. -->
    <section data-fragment="googleid" raw="true" ></section>
    <!-- don't cache this document in sessionStorage -->
    <section data-fragment="googleid" cache="false"></section>
