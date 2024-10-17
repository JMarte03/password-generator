import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import BouncyCheckbox from 'react-native-bouncy-checkbox' // Just a package for checkboxes

// Form validation
import * as Yup from 'yup' // Yup is a package for validation
import { Formik } from 'formik' // Formik is an easy way to create forms in react native

const PasswordSchema = Yup.object().shape({ // a schema allows me to create a model for validating data, in this case, the password length
  passwordLength: Yup.number() // validate that is a number (through yup)
   .min(4, 'Should be min of 4 characters') // validate that is at least 4 
   .max(16, 'Should be max of 16 characters') // validate that is not more than 16
   .required('Length is required') // make it mandatory to fill
})

export default function App() {
  /* 
    'useState' is a hook that helps me use the State feature in react 
    without having to create a class for it. So a state is the 
    data of a component that changes. For example, if is visible or not. 
  */
  const [password, setPassword] = useState('') // The second parameter is a function that changes the value of the first parameter (variable)
  const [isPassGenerated, setIsPassGenerated] = useState(false)
  const [lowerCase, setLowerCase] = useState(true) 
  const [upperCase, setUpperCase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [symbols, setSymbols] = useState(false)

  const generatePasswordString = (passwordLength: number) => { // This function creates a string with all the characters preferences that the user wants. Then it calls the function createPassword, and returns the actual password
    
    let characterList = ''
    
    const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
    const digitChars = '0123456789'
    const specialChars = '!@#$%^&*()_+'

    if (upperCase) {
      characterList += upperCaseChars
    }
    if (lowerCase) {
      characterList += lowerCaseChars
    }
    if (numbers) {
      characterList += digitChars
    }
    if (symbols) {
      characterList += specialChars
    }

    const passwordResult = createPassword(characterList, passwordLength)
    setPassword(passwordResult)
    setIsPassGenerated(true)

  }

  const createPassword = (characters: string, passwordLength: number) => { // This is the function where all the randomnization and final password's length takes place. 
    let result = ''
    for (let i = 0; i < passwordLength; i++){ // Runs the below code 'passwordLength' times
      const characterIndex = Math.round(Math.random() * characters.length) // Returns a random integer no greater than the characterList set by the user 
      result += characters.charAt(characterIndex) // Returns a character from the characterList at the position of the random integer generated
    }
    return result // Returns the password 
  }

  const resetPasswordState = () => { // This function restarts the states. Triggers when we click the 'Reset' button in the UI
    setPassword('')
    setIsPassGenerated(false)
    setLowerCase(true)
    setUpperCase(false)
    setNumbers(false)
    setSymbols(false)
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled"> 
      <SafeAreaView style={styles.appContainer}>
        {/* 
          This view contains a title, and the form (input number for 
          the password length, checkboxes for the prefereces/characterList 
          and buttons to generate the pass or reset everything) 
        */}
        <View>  
          <Text style={styles.title}>Password Generator</Text>
          {/* Basically telling: to create a form. In this case using Formik features. The ENTIRE form will be wrapped between 'Formik' tags */}
          <Formik
          initialValues={{ passwordLength: '' }}
          validationSchema={PasswordSchema} // The validation schema that we're going to use is the one we created before, which uses Yup.
          onSubmit={ values => { 
            console.log(values);
            generatePasswordString(Number(values.passwordLength)) 
          }}
          >
            {({
              // stuff that Formik handles
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset,
              /* and other goodies */
            }) => (
          <>
          {/* Each input wrapper contains a label, and an input. Whether is a type number, or a checkbox */}
          <View style={styles.numberInputWrapper}>
            {/* The input type number below */}
            <TextInput 
              style={styles.numberInputStyle} 
              value={values.passwordLength} 
              onChangeText={handleChange('passwordLength')} 
              keyboardType='numeric'
              placeholder='Length'
            />
          </View>
            {touched.passwordLength && errors.passwordLength && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {/* Renders an error message */}
                  {errors.passwordLength} 
                </Text>
              </View>
            )}

          <View style={styles.checks}>
            <View style={[styles.checkInputWrapper, styles.cardElevated]}>
              <BouncyCheckbox 
                isChecked={lowerCase} // isChecked(true/false) will be equaled to the state default or reset value. In this case is true, so lowercase will always be checked for default.
                onPress={ () => setLowerCase(!lowerCase) } // Toggles the value of the state every time the input is clicked.
                fillColor='#29AB87' 
              />
              <Text style={styles.heading}>Lowercase</Text>
            </View>
            <View style={[styles.checkInputWrapper, styles.cardElevated]}>
              <BouncyCheckbox 
                isChecked={upperCase}
                onPress={ () => setUpperCase(!upperCase) }
                fillColor='#29AB87'
              />
              <Text style={styles.heading}>Uppercase</Text>
            </View>
            <View style={[styles.checkInputWrapper, styles.cardElevated]}>
              <BouncyCheckbox 
                isChecked={numbers}
                onPress={ () => setNumbers(!numbers) }
                fillColor='#29AB87'
              />
              <Text style={styles.heading}>Numbers</Text>
            </View>
            <View style={[styles.checkInputWrapper, styles.cardElevated]}>
              <BouncyCheckbox 
                isChecked={symbols}
                onPress={ () => setSymbols(!symbols) }
                fillColor='#29AB87'
              />
              <Text style={styles.heading}>Symbols</Text>
            </View>
          </View>
          
          
          {/* 
            This section has the action part of the form, in other words, the buttons. 
            This can either send the data to the schema and generate the password
            or reset the entire to it's original state. Think of 'input type="submit"' in HTML.
          */}
          <View style={styles.formActions}>
            {/* GENERATE PASSWORD */}
            <TouchableOpacity 
            disabled={!isValid} // only available when the form is valid
            style={styles.primaryBtn}
            onPress={ () => handleSubmit() } // runs 'handleSubmit' when clicked, which also runs the function of 'generatePasswordString'
            >
              <Text style={styles.primaryBtnTxt}>Generate Password</Text>
            </TouchableOpacity>

            {/* RESET FORM */}
            <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={ () => {
              handleReset()
              resetPasswordState()
            } }
            >
              <Text style={styles.secondaryBtnTxt}>Reset</Text>
            </TouchableOpacity>
          </View>
         </>
       )}
          </Formik>
        </View>
       {/* 
          This block of code renders a View for the password when the user
          click on 'Generate Password' and all requirements are fulfilled. 
          In other words, when the 'isPassWordGenerated' state is set to 
          'true'.
       */}
        {isPassGenerated ? ( // 
          <View style={[styles.resultContainer, styles.cardElevated]}>
            <Text selectable style={styles.generatedPassword}>{password}</Text>
            <Text style={styles.description}>Long Press to copy</Text>
          </View>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
  heading: {
    fontSize: 15,
  },
  numberInputWrapper: {
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberInputStyle: {
    textAlign: 'center',
    width: '100%',
    borderWidth: .5,
    borderColor: 'gray',
    borderRadius: 10
  },
  checks: {
    marginVertical: 20
  },
  checkInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
    padding: 30,
    borderRadius: 10
  },
  label: {
    flexDirection: 'column',
  },
  errorContainer: {
   width: '100%',
   backgroundColor: '#FFE3E0',
   padding: 10,
   borderRadius: 3,
  },
  errorText: {
    fontSize: 12,
    color: '#ff0d10',
  },
  formActions: {
    flex: 1,
    gap: 5,
    marginVertical: 10,
    justifyContent: 'center',
  },
  primaryBtn: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: 50,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#5DA3FA',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: 50,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#CAD5E2',
  },
  secondaryBtnTxt: {
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    marginVertical: 20,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color:'#000'
  },
});