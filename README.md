This represents a simple application that connects xterm to a shell on the backend.

Frontend uses Node LTS 10.x and yarn package manager.
##### Installing Node
1.  Install [Node Version Manager](https://github.com/creationix/nvm)
2.  Install the latest stable 10.x:
    `nvm install 10`
3.  Set this node version as your default version:
    `nvm alias default 10`
4.  Verify your default alias with:
    `nvm list`
5.  Verify that node is active with:
    `node --version`
    
##### Installing Frontend Dependencies

```bash
cd ~/fullstack-takehome-assessment/frontend
npm install
```

#### Running Frontend Server

`npm run dev`

-----------------------
Backend uses Python 3.7 and manages packages via virtualenv.

#### Install Python dependencies

We use virtualenv to manage our Python dependencies

```bash
cd ~/fullstack-takehome-assessment/backend
python3 -m venv env
source env/bin/activate
```

At this point, you can run:

```bash
pip install -r requirements.txt
```

#### Launching Application
Activate virtual environment
```bash
cd ~/fullstack-takehome-assessment/backend
source env/bin/activate
```
Launch PostgreSQL and Redis using docker-compose, run initial migrations,
launch the development server 
```bash
docker-compose up -d
./manage.py migrate
./manage.py runserver 5000
```
Launch frontend build 
```bash
cd ~/fullstack-takehome-assessment/frontend
npm run dev
```

The application is going to be available on http://localhost:5000/
