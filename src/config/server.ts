import app from '../app';

import {connect} from '../database/mongoose';

connect();

app.listen(process.env.PORT || 3333);