{
    label: 'User',
    plural: 'Users',
    description: 'System User',
    fields: [{
        label: 'Domain Name',
        name: 'DomainName',
        text: { length: 100, required: true }
    },{
        label: 'First Name',
        name: 'FirstName',
        text: { length: 100 }
    },{
        label: 'Last Name',
        name: 'LastName',
        text: { length: 100 }
    },{
        label: 'Full Name',
        name: 'FullName',
        formula: { sql: 'FirstName + \' \' + LastName', persistant: true }
    }],
    layouts: [{
        name: 'Main',
        layout0: { title: 'General Information', l: [
            ['DomainName', ''],
            ['FirstName', 'LastName']]},
    }],
    lists: [{
        name: 'Main',
        l: { DomainName: {}, FirstName: {}, LastName: {} },
    }]
}