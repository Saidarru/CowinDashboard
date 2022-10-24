// Write yourader code here
import {Component} from 'react'
import {Loader} from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {chartList: {}, isLoading: apiStatus.initial}

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const lastDaysVaccination = data.last_7_days_vaccination.map(
        eachItem => ({
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
          vaccineDate: eachItem.vaccine_date,
        }),
      )

      const vaccinationByAge = data.vaccination_by_age
      const vaccinationByGender = data.vaccination_by_gender

      this.setState({
        chartList: {lastDaysVaccination, vaccinationByAge, vaccinationByGender},
        isLoading: apiStatus.success,
      })
    } else {
      this.setState({isLoading: apiStatus.failure})
    }
  }

  failureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  loadingView = () => (
    <div>
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  successView = () => {
    const {chartList} = this.state
    const {
      lastDaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = chartList
    return (
      <>
        <VaccinationCoverage lastDaysVaccination={lastDaysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </>
    )
  }

  renderView = () => {
    const {isLoading} = this.state
    switch (isLoading) {
      case apiStatus.success:
        return this.successView()
      case apiStatus.failure:
        return this.failureView()
      case apiStatus.inProgress:
        return this.loadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <h1 className="logo-heading">Co-WIN</h1>
        </div>
        <h1 className="header">CoWIN Vaccination in India</h1>
        {this.renderView()}
      </div>
    )
  }
}
export default CowinDashboard
