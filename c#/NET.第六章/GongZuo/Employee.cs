using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GongZuo
{
    public class Employee
    {

        private int age;

        public int Age
        {
            get { return age; }
            set { age = value; }
        }
        private Gender Gender;

        public Gender Gender1
        {
            get { return Gender; }
            set { Gender = value; }
        }
        private string ID;

        public string ID1
        {
            get { return ID; }
            set { ID = value; }
        }
        private string Name;

        public string Name1
        {
            get { return Name; }
            set { Name = value; }
        }
       


        //Gender e = new Gender();
        protected List<Job> WorkList { get; set; }

        public Employee() { }
        public Employee(string id,int age,string name,Gender gender,List<Job> list)
        {
            this.ID = id;
            this.Age = age;
            this.Name1 = name;
            this.Gender1 = gender;
            this.WorkList = list;
        }
    }
}
