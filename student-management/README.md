# 🚀 Next.js Project - Installation & Setup Guide  

## I. Clone the Project  
First, download the source code by running:  
```bash
git clone <repository_url>
cd <project_folder>
```

## II. Install Dependencies
Since the node_modules folder is not included in the repository, you need to reinstall dependencies:
```bash
npm install  # If using npm
# or
yarn         # If using yarn
# or
pnpm install # If using pnpm
# or
bun install  # If using bun
```

## III. Run the Development Server
After installing dependencies, start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Then open your browser and visit: http://localhost:3000

## IV. Deploy to Vercel
To deploy the project on Vercel, run:
```bash
npx vercel
```
Or use the web interface: https://vercel.com/new

## V. Important notes
This project uses Next.js, so ensure Node.js >= 18. Check your Node.js version with:
```bash
node -v
```
If you encounter issues, try the following:
```bash
rm -rf node_modules package-lock.json
npm install
```

# 🎓 Student Management System - Version 1 Features 
## I. Display student information
![display student](../screenshots/displayStudent.png)
- This feature displays a list of students who have been added to the student management system. For better UI/UX, only key information is shown. To view full student details, click the "Detail" button above.
## II. Search student information
![search student](../screenshots/displayStudent.png)
- This feature allows users to search for students by their identification number, name (including partial matches), faculty (Law, Business English, Japanese, French), course, and study status (Enrolled, Graduated, Withdrawn, Temporarily Suspended). The server will filter the information and return the results to the user. 
- After entering the desired search criteria in the filter bar, click the "Search" button to apply the filter.
## III. Add student information
![add student](../screenshots/addStudent.png)
- This feature allows users to add a new student to the database.
- After entering all the required information, click "Save" to add the new student or "Cancel" to discard the action and return to the student list screen.
## IV. Edit student information
![edit student](../screenshots/editStudent.png)
- This feature allows users to edit a new student to the database.
- After entering all the required information, click "Save" to add the new student or "Cancel" to discard the action and return to the student list screen.