  using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace 影院售票系统
{
    class Cinema//影院类
    {//Seat座位信息
        private Dictionary<string, Seat> seats = new Dictionary<string, Seat>();

        internal Dictionary<string, Seat> Seat
        {
            get { return seats; }
            set { seats = value; }
        }

        public Schedule Schedule { get; set; }//自定义放映计划
        //已售票集合
        private List<Ticket> list = new List<Ticket>();

        internal List<Ticket> List
        {
            get { return list; }
            set { list = value; }
            
        }

        public void Save()
        {
            
        }

        public void Load()
        {
            

        }

    }
}
