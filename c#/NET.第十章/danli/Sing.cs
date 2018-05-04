using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace danli
{
    class Sing
    {
        public  string SongPath { get; set; }//歌曲地址
        public  string  SongName { get; set; }//歌曲

        public Sing()
        {
            
        }
        
        public Sing(string songpath, string sonogname)
        {
            this.SongName = sonogname;
            this.SongPath = songpath;
        }

    }
}
