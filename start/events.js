const Event = use('Event')

Event.on('user::forgotPassword', 'User.forgotPassword')
Event.on('user::validated', 'User.validated')
