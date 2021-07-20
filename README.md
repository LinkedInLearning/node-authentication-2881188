# Node: Authentication
This is the repository for the LinkedIn Learning course Node: Authentication. The full course is available from [LinkedIn Learning][lil-course-url].

![Node: Authentication][lil-thumbnail-url] 

If you have a website, you want visitors. And if you run a business through a website, you want those visitors to be customers. To do that, you need user registration and authentication. Authentication is the foundation of most web applications, letting you determine who is visiting your site and helping you connect them with privileges they should or should not have. In this course, Daniel Khan shows how to add user registration and authentication to an app built with Node.js and Express.js. He covers everything from simple logins using a username and password stored in a database to more complex login methods like single sign-on. Daniel teaches this hands-on course with realistic sample projects, so that you can apply this knowledge to your own work right away.

## Instructions
This repository has branches for each of the videos in the course. You can use the branch pop up menu in github to switch to a specific branch and take a look at the course at that stage, or you can add `/tree/BRANCH_NAME` to the URL to go to the branch you want to access.

## Branches
The branches are structured to correspond to the videos in the course. The naming convention is `CHAPTER#_MOVIE#`. As an example, the branch named `02_03` corresponds to the second chapter and the third video in that chapter. 
Some branches will have a beginning and an end state. These are marked with the letters `b` for "beginning" and `e` for "end". The `b` branch contains the code as it is at the beginning of the movie. The `e` branch contains the code as it is at the end of the movie. The `main` branch holds the final state of the code when in the course.

When switching from one exercise files branch to the next after making changes to the files, you may get a message like this:

    error: Your local changes to the following files would be overwritten by checkout:        [files]
    Please commit your changes or stash them before you switch branches.
    Aborting

To resolve this issue:
	
    Add changes to git using this command: git add .
	Commit changes using this command: git commit -m "some message"

## Installing
1. To use these exercise files, you must have the following installed:
	- [list of requirements for course]
2. Clone this repository into your local machine using the terminal (Mac), CMD (Windows), or a GUI tool like SourceTree.
3. [Course-specific instructions]


### Instructor

Daniel Khan 
                            
Technology Lead, Developer, Application Architect

                            

Check out my other courses on [LinkedIn Learning](https://www.linkedin.com/learning/instructors/daniel-khan).

[lil-course-url]: https://www.linkedin.com/learning/node-authentication
[lil-thumbnail-url]: https://cdn.lynda.com/course/2881188/2881188-1624987742273-16x9.jpg
