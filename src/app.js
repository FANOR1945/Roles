const express = require('express');
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const ExpressApp = express();
const cors = require('cors');

require('./config/database');
const { Port, LOCALHOST } = require('./config/config');

ExpressApp.use(bodyParser.json());
ExpressApp.use(express.json());
ExpressApp.use(express.text());
ExpressApp.use(cookieParser());

ExpressApp.use(cors({ origin: '*' }));

//routes
//const authRoutes = require('./routes/auth/auth.routes');

const userRoutes = require('./routes/roles/user.routes');
//const roleRoutes = require('./routes/role/role.routes');

//const especiesRoutes = require('./routes/service/specie.routes');
ExpressApp.use('/users', userRoutes);
/*ExpressApp.use('/auth', authRoutes);
ExpressApp.use('/rols', roleRoutes);
ExpressApp.use('/species', especiesRoutes);*/
ExpressApp.listen(Port, LOCALHOST, () => {
  console.log(`Server is running on http://${LOCALHOST}:${Port}`);
});
