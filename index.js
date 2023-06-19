
const { pool } = require('./connection');

//const { ApolloServer, gql } = require('apollo-server');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// const {
//   GraphQLObjectType,
//   GraphQLInt,
//   GraphQLString,
//   GraphQLNonNull,
//   GraphQLList,
//   GraphQLSchema
// } = require('graphql')

const schema = buildSchema(`
  type Employee {
    id: ID!
    name: String!
    department: String!
    salary:ID!
    managerId: ID
    manager: [Manager]
  }

  type Manager {
    id: ID!
    name: String!
    employees: [Employee]
  }

  type Query {
    employees: [Employee]
    employee(id: ID!): Employee
    managers: [Manager]
    manager(id: ID!): Manager
  }

  type Mutation {
    createEmployee(name: String!, department: String!, managerId: ID): Employee
    createManager(name: String!): Manager
  }
`)

// const typeDefs = gql`
//   type Employee {
//     id: ID!
//     name: String!
//     department: String!
//     salary:ID!
//     managerId: ID
//     manager: [Manager]
//   }

//   type Manager {
//     id: ID!
//     name: String!
//     employees: [Employee]
//   }

//   type Query {
//     employees: [Employee]
//     employee(id: ID!): Employee
//     managers: [Manager]
//     manager(id: ID!): Manager
//   }

//   type Mutation {
//     createEmployee(name: String!, department: String!, managerId: ID): Employee
//     createManager(name: String!): Manager
//   }
// `;


const employeesData = [
  { id: '1', name: 'SATYA K', department: 'Research', salary: '500000', managerId: '3' },
  { id: '2', name: 'Teja sai', department: 'Backend Developer', salary: '40000', managerId: '3' },
  { id: '3', name: 'Tulasi Posimsetti', department: 'Developer', salary: '25000' },
];

const managersData = [
  { id: '3', name: 'Chitan' },
  { id: '4', name: 'Arjun ' },
];

const root = {
  getEmployees : async () => {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT * FROM employees');

      return result.rows;

    } catch (error) {
      console.log("error", error.message);
    }
    finally {
      client.release();
    }
  },
}

const resolvers = {
  Query: {
    employees: async () => {
      const client = await pool.connect();

      try {
        const result = await client.query('SELECT * FROM employees');

        return result.rows;

      } catch (error) {
        console.log("error", error.message);
      }
      finally {
        client.release();
      }
    },
    employee: (_, { id }) => employeesData.find(emp => emp.id === id),
    managers: () => managersData,
    manager: (_, { id }) => managersData.find(mgr => mgr.id === id),
  },
  Employee: {
    manager: (employee) => managersData.find(mgr => mgr.id === employee.managerId),
  },
  Manager: {
    employees: (manager) => employeesData.filter(emp => emp.managerId === manager.id),
  },

  Mutation: {
    createEmployee: (_, { name, department, managerId }) => {
      const newEmployee = {
        id: String(employeesData.length + 1),
        name,
        department,
        managerId,
      };
      employeesData.push(newEmployee);
      return newEmployee;
    },
    createManager: (_, { name }) => {
      const newManager = {
        id: String(managersData.length + 1),
        name,
      };
      managersData.push(newManager);
      return newManager;
    },
  },
};


const app = express();

app.use('/api', graphqlHTTP({
  schema : schema,
  rootValue: resolvers,
  graphiql: true
}))
const PORT = 5000
//const server = new ApolloServer({ typeDefs, resolvers });

app.listen(PORT, () => {
  console.log(`app is running on the port number ${PORT}`)
})

