const express = require('express');
const router = express.Router();
const db = require('./model');
const bcrypt = require('bcrypt'); //密码加密
const uuid = require('node-uuid');


// 获取 Todos
router.get('/api/getTodos', function (req, res) {
    const Data = {
        userId: req.query.userId
    };
    db.Todo.find(Data, function (err, docs) {
        if (err) {
            console.error(err);
            return;
        }
        res.json(docs);
    })
})

// save todos
router.post('/api/saveTodos', (req, res) => {
    const Todos = {
        data: req.body.data,
        userId: req.body.userId
    };
    db.Todo.find({
        userId: req.body.userId
    }, function (err, docs) {
        if (err) {
            console.log(err);
            return;
        }
        if (docs.length > 0) {
            docs[0].data = req.body.data;
            db.Todo(docs[0].save(function (err) {
                if (err) {
                    res.status(500).send();
                    return;
                }
                res.send();
            }));
        } else {
            db.Todo(Todos).save(function (err) {
                if (err) {
                    res.status(500).send();
                    return;
                }
                res.send();
            });
        }
    })
});


// 添加 todo
router.post("/api/addTodo", (req, res) => {
    const newTodo = {
        data: req.body.data,
        userId: req.body.userId
    };

    db.Todo(newTodo).save(function (errors) {
        if (errors) {
            res.status(500).send()
            return
        }
        res.send();
    });
});


// 删除 Todo
router.post('/api/removeTodo', function (req, res) {
    db.Todo.remove({
        _id: req.body._id,
    }, function (err) {
        if (err) {
            console.log(err)
            return
        }
        res.send();
    })
});

//注册
router.post('/api/users/register', function (req, res) {
    db.User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (user) {
                res.json({
                    msg: '用户已存在!'
                });
                return false;
            } else {
                let userInfo = {
                    userName: req.body.userName,
                    email: req.body.email,
                    password: req.body.password,
                    userId: uuid.v4()
                };
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(userInfo.password, salt, function (err, hash) {
                        if (err) throw err;
                        userInfo.password = hash;
                        db.User(userInfo).save(function (err) {
                            if (err) {
                                res.status(500).send();
                                return
                            }
                            const data = {
                                msg: '注册成功!',
                                userId: userInfo.password
                            }
                            res.json(data);
                            res.send();
                        })
                    });
                });
            }
        })
});

// 登陆
router.post('/api/users/login', (req, res) => {
    db.User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                res.json({
                    msg: '用户不存在，请先注册',
                });
                return false;
            }
            // 密码验证
            bcrypt.compare(req.body.password, user.password, function (err, isMath) {
                if (err) throw err;

                if (isMath) {
                    res.json({
                        msg: '登陆成功',
                        userId: user.userId,
                        userName: user.userName,
                        loginState: true
                    });
                } else {
                    res.json({
                        msg: '密码错误',
                    });
                }
            });
        })
})

// 退出登陆
router.get('/api/users/logout', (err, res) => {
    res.json('退出登陆成功');
});

module.exports = router;
