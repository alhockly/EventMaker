/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
  TextInput
} from 'react-native';
import Share from 'react-native-share';
const Buffer = require("buffer").Buffer;

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// import DateTimePicker from 'react-native-ui-datepicker';
// import dayjs from 'dayjs';

import DateTimePicker from '@react-native-community/datetimepicker';
import CheckBox from '@react-native-community/checkbox';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}


const parseISOString = (s:String ) => {
  var b = s.split(/\D+/);
  return new Date(`${b[0]}-${b[1]}-${b[2]}T${b[3]}:${b[4]}:${b[5]}`);
}

const mergeDateAndTime = (date: Date, time: Date) => {
  return `${date.toISOString().slice(0,10)}${time.toISOString().slice(10,17)}00`
}

const generate_ics = (title: String, description: String, startDate: Date, startTime: Date, endDate: Date, endTime: Date, fake: Boolean) => {

  const startStr = mergeDateAndTime(startDate, startTime).replaceAll("-", "").replaceAll(":","")

  var endStr =""
  if(endDate){
    endStr = mergeDateAndTime(endDate, endTime).replaceAll("-", "").replaceAll(":","")
  } else {
    endStr = mergeDateAndTime(startDate, endTime).replaceAll("-", "").replaceAll(":","")
  }

  var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  console.log("example")
  console.log(startStr)
  console.log("20240131T113000")
  console.log(endStr)


  

  return `BEGIN:VCALENDAR\r
VERSION:2.0\r
PRODID:EventMaker\r
BEGIN:VEVENT\r
UID:1997063819\r
DTSTAMP:${startStr}Z\r
DTSTART;TZID=${timezone}:${startStr}\r
DTEND;TZID=${timezone}:${endStr}\r
SUMMARY: ${title}\r
END:VEVENT\r
END:VCALENDAR\r\n`

  
//       return `BEGIN:VCALENDAR\r
// VERSION:2.0\r
// PRODID:spatie/icalendar-generator\r
// BEGIN:VTIMEZONE\r
// TZID:Europe/London\r
// BEGIN:STANDARD\r
// DTSTART:20231029T020000Z\r
// TZOFFSETFROM:+0100\r
// TZOFFSETTO:+0000\r
// END:STANDARD\r
// BEGIN:DAYLIGHT\r
// DTSTART:20240331T010000Z\r
// TZOFFSETFROM:+0000\r
// TZOFFSETTO:+0100\r
// END:DAYLIGHT\r
// END:VTIMEZONE\r
// BEGIN:VTIMEZONE\r
// TZID:UTC\r
// BEGIN:STANDARD\r
// DTSTART:20230501T195903Z\r
// TZOFFSETFROM:+0000\r
// TZOFFSETTO:+0000\r
// END:STANDARD\r
// END:VTIMEZONE\r
// BEGIN:VEVENT\r
// UID:65b40f0741d18\r
// DTSTAMP:20240126T195903Z\r
// SUMMARY:Barre Fit\r
// LOCATION:Wavelengths Leisure Centre\, Giffin Street\, Deptford\, London\r
// DTSTART;TZID=Europe/London:20240131T113000\r
// DTEND;TZID=Europe/London:20240131T122000\r
// GEO:51.477728;-0.023649\r
// X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=Wavelengths Leisure Centre\
//   , Giffin Street\, Deptford\, London\, SE8 4RJ;X-APPLE-RADIUS=72;X-TITLE=Wa
//   velengths Leisure Centre:geo:51.477728,-0.023649\r
// END:VEVENT\r
// END:VCALENDAR\r\n`
    
}




function App(): React.JSX.Element {

  const [title, onTitleChange] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isMultiDay, setIsMultiDay] = React.useState(false);


  const [startDate, setStartDate] = React.useState(null);
  const [startTime, setStartTime] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [endTime, setEndTime] = React.useState(null);
  const [startDateSetterOpen, setStartDateSetterOpen] = React.useState(false);
  const [startTimeSetterOpen, setStartTimeSetterOpen] = React.useState(false);
  const [endDateSetterOpen, setEndDateSetterOpen] = React.useState(false);
  const [endTimeSetterOpen, setEndTimeSetterOpen] = React.useState(false);

  const [startString, setStartString] = React.useState("");
  const [endString, setEndString] = React.useState("");

  const [mode, setMode] = React.useState('date');
  const [defaultDate, setDefaultDate] = React.useState(new Date());
  

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    if(startDate != null && startTime!= null){
      var start = mergeDateAndTime(startDate, startTime)
      console.log("start", start)
      const startDateObj = parseISOString(start)
      console.log(startDateObj.toString())
      setStartString(startDateObj.toString().slice(0, 24))

      if(!isMultiDay){
        setEndDate(startDate)
      }
    }

    if(endDate != null && endTime !=null){
      var end = mergeDateAndTime(endDate, endTime)
      const endDateObj = parseISOString(end)
      console.log("end date obj",endDateObj.toString())
      setEndString(endDateObj.toString().slice(0, 24))

    }
    
  }, [startDate, startTime, endDate, endTime]);

  const onShare = async () => {
    try {
   
      const ics = generate_ics(title, description, startDate, startTime, endDate, endTime, true)
      const data = Buffer.from(ics).toString('base64')
  
      const result = await Share.open({
        url:
        `data:text/calendar;base64,${data}`,
        filename: title
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error)
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate)
    console.log(event)

    if(event.type == "dismissed"){
      if(startDateSetterOpen){setStartDateSetterOpen(false)}
      if(endDateSetterOpen){setEndDateSetterOpen(false)}
      setMode("date")
      return
    }
    

    if(startDateSetterOpen){
      // setStartDate(currentDate)
      if(mode == "date"){
        //setDefaultDate(currentDate);
        setMode("time")
        setStartDate(currentDate);
        
        return
      }
      else{
        setStartTime(currentDate);
        setStartDateSetterOpen(false)
        console.log(startDate)
        console.log(currentDate)
        setMode("date")
      }
      
      return
    }
    
    if(endDateSetterOpen){
      if(mode == "date"){
        setEndDate(currentDate);
        setMode("time")
        return
      }
      else{
        setEndTime(currentDate);
        setEndDateSetterOpen(false)
        console.log(endDate)
        console.log(currentDate)
        setMode("date")
      }
      
      return
    }

  };


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View  style={{margin:12, height:"100%"}}>

        <Text style={{fontSize:32, top:36, textAlign: "center"}}>Event Maker</Text>


        <View style={{height:"10%"}}/>
          <View style={{paddingLeft:6}}>
            <Text>Title</Text>
            <TextInput value={title} onChangeText={onTitleChange}/>
            <Text>Description</Text>
            <TextInput value={description} onChangeText={setDescription}/>
          </View>

          <View style={{ 
            flexDirection: 'row'}}>
            <CheckBox
              disabled={false}
              value={isMultiDay}
              onValueChange={(newValue) => setIsMultiDay(newValue)}
            />
            <Text style={{top:5}}>multi-day?</Text>
          </View>
          <View style={{margin:10}}>

          <View style={{ 
            flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize:24, width:64}}>Start</Text>
            <Text style={{textAlign: "right", top:8}}>{startString}</Text>
            <View style={{ justifyContent: 'flex-end' }}>
              <Button title="set"  onPress={() => {setStartDateSetterOpen(!startDateSetterOpen)}}></Button>
            </View>
          </View>

          <View style={{margin:10}}></View>

          <View style={{ 
            flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize:24, width:64}}>End</Text>
            <Text style={{textAlign: "right", top:8}}>{endString}</Text>
            <View style={{ justifyContent: 'flex-end' }}>
              <Button title="set" onPress={() => {
                                                    if(!isMultiDay){
                                                      setMode("time")
                                                    }
                                                    setDefaultDate(startDate); 
                                                    setEndDateSetterOpen(!endDateSetterOpen)
                                                  }}
                                                  disabled={!startDate}
              />
            </View>
          </View>

          <View style={{margin:10}}></View>

    


          <View style={{height:20}}/>


 


          <View style={{height:100}}/>

          

          <Button title='Share event' onPress={onShare} disabled={!(title && startDate && startTime && endTime)} />
        </View>


        

      </View>

        {(startDateSetterOpen || endDateSetterOpen) && (
          <DateTimePicker
            testID="dateTimePicker"
            value={defaultDate}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
    </SafeAreaView>

    
  );
}



const styles = StyleSheet.create({
  button: {
    margin: 100,
    padding: 100,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
